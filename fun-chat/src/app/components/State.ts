import {
  CurrentUser,
  UserResponse,
  MessageResponse,
  MessageStatus,
  StatusResponse,
} from '../utils/types';
import storage from './Storage';
import emitter from './EventEmitter';
import { formatDate } from '../utils/helpers';

type UserData = {
  notifications: number;
  isLogined: boolean;
};

type EditedMsg = {
  id: string;
  text: string;
};

class State {
  public usersMap: Map<string, UserData> = new Map();
  public messagesMap: Map<string, MessageResponse> = new Map();
  protected currUser: CurrentUser = {
    id: '',
    login: '',
    password: '',
  };

  protected dialogUser: UserResponse = {
    login: '',
    isLogined: true,
  };

  public dialogId: string = '';

  public editedMsg: EditedMsg = {
    id: '',
    text: '',
  };

  constructor() {
    const user = storage.getData('user');
    if (user) {
      this.currUser.login = user.login;
      this.currUser.password = user.password;
    }
  }

  public updateState() {
    this.usersMap.clear();
    this.messagesMap.clear();
    this.dialogUser = { login: '', isLogined: true };
  }

  public saveUser(user: CurrentUser) {
    this.currUser = { ...user };
  }

  public getUser(): CurrentUser {
    return this.currUser;
  }

  public setEditedMsg(id: string, text: string) {
    this.editedMsg = { id, text };
  }

  public getEditedMsg(): EditedMsg {
    return this.editedMsg;
  }

  public changeUserStatus(user: UserResponse) {
    const userData = this.usersMap.get(user.login);
    if (userData) {
      userData.isLogined = user.isLogined;
    } else {
      this.usersMap.set(user.login, { notifications: 0, isLogined: user.isLogined });
    }

    if (user.login === this.dialogUser.login) {
      emitter.emit('change-status', user.isLogined);
    }
  }

  public setNotifications(login: string, notifications: number) {
    const userData = this.usersMap.get(login);
    if (!userData) {
      throw new Error(`user is undefined`);
    }

    userData.notifications = notifications;
    if (userData.isLogined) {
      emitter.emit('external-login', login, userData.notifications);
    } else {
      emitter.emit('external-logout', login, userData.notifications);
    }
  }

  public setDialogUser(login: string): void {
    const userData = this.usersMap.get(login);
    if (userData === undefined) {
      throw new Error(`status is undefined`);
    }
    const { isLogined } = userData;

    this.dialogUser = {
      login,
      isLogined,
    };
  }

  public getDialogUser(): UserResponse {
    return this.dialogUser;
  }

  public addMessage(msg: MessageResponse) {
    this.messagesMap.set(msg.id, msg);
    const author = msg.from === this.currUser.login;
    const dialogUser = msg.from;
    const date = formatDate(msg.datetime);
    const status = msg.status.isDelivered ? MessageStatus.Delivered : MessageStatus.Sent;
    const msgProps = {
      id: msg.id,
      author,
      dialogUser,
      date,
      status,
      text: msg.text,
      isEdited: false,
    };

    if (!author) {
      state.addNotification(msg.from);
    }
    if (!author && msg.from !== this.dialogUser.login) {
      return;
    }

    emitter.emit('add-message', msgProps);
  }

  public addMessages(msgs: MessageResponse[]) {
    this.messagesMap.clear();
    msgs.forEach((msg) => {
      this.messagesMap.set(msg.id, msg);
    });
    const messages = msgs.map((msg) => {
      const author = msg.from === this.currUser.login;
      const dialogUser = msg.from;
      const date = formatDate(msg.datetime);
      const status = this.getStatus(msg.status);
      const { isEdited } = msg.status;

      return {
        id: msg.id,
        author,
        dialogUser,
        date,
        status,
        text: msg.text,
        isEdited,
      };
    });
    emitter.emit('add-messages', messages);
  }

  protected getStatus(statusResponse: StatusResponse): string {
    let status = '';
    status = statusResponse.isDelivered ? MessageStatus.Delivered : MessageStatus.Sent;
    status = statusResponse.isReaded ? MessageStatus.Readed : status;
    return status;
  }

  public addNotification(login: string) {
    const userData = this.usersMap.get(login);
    if (!userData) {
      throw new Error(`user is undefined`);
    }
    userData.notifications += 1;
    emitter.emit('update-notifications', login, userData.notifications);
  }

  public resetNotifications() {
    const userData = this.usersMap.get(this.dialogUser.login);
    if (!userData) {
      throw new Error(`user is undefined`);
    }
    userData.notifications = 0;
    emitter.emit('update-notifications', this.dialogUser.login, userData.notifications);
  }
}

const state = new State();
export default state;
