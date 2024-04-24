import {
  CurrentUser,
  MessageStatus,
  StatusResponse,
  UserData,
  EditedMsg,
  Unreaded,
} from '../utils/types';
import storage from './Storage';
import emitter from './EventEmitter';
import { formatDate } from '../utils/helpers';
import { UserResponse, MessageResponse } from '../utils/typesResponses';
import { EVENT } from '../utils/constants';

class State {
  public usersMap: Map<string, UserData> = new Map();
  public messagesMap: Map<string, MessageResponse> = new Map();

  public unreadEdMap: Map<string, string> = new Map();
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
  public deleteRequestId: string = '';

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

  public updateState(): void {
    this.usersMap.clear();
    this.messagesMap.clear();
    this.dialogUser = { login: '', isLogined: true };
  }

  public saveUser(user: CurrentUser): void {
    this.currUser = { ...user };
  }

  public getUser(): CurrentUser {
    return this.currUser;
  }

  public setEditedMsg(id: string, text: string): void {
    this.editedMsg = { id, text };
  }

  public getEditedMsg(): EditedMsg {
    return this.editedMsg;
  }

  public changeUserStatus(user: UserResponse): void {
    const userData = this.usersMap.get(user.login);
    if (userData) {
      userData.isLogined = user.isLogined;
    } else {
      this.usersMap.set(user.login, { notifications: 0, isLogined: user.isLogined });
    }

    if (user.login === this.dialogUser.login) {
      emitter.emit(EVENT.change_status, user.isLogined);
    }
  }

  public setNotifications(login: string, notifications: number): void {
    const userData = this.usersMap.get(login);
    if (!userData) {
      throw new Error(`user is undefined`);
    }

    userData.notifications = notifications;
    if (userData.isLogined) {
      emitter.emit(EVENT.external_login, login, userData.notifications);
    } else {
      emitter.emit(EVENT.external_logout, login, userData.notifications);
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

  public addMessage(msg: MessageResponse): void {
    if (msg.from === this.dialogUser.login || msg.from === this.currUser.login) {
      this.messagesMap.set(msg.id, msg);
    }

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
      this.unreadEdMap.set(msg.id, msg.from);
    }
    if (!author && msg.from !== this.dialogUser.login) {
      return;
    }

    emitter.emit(EVENT.add_message, msgProps);
  }

  public addMessages(msgs: MessageResponse[]): void {
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
    emitter.emit(EVENT.add_messages, messages);
  }

  protected getStatus(statusResponse: StatusResponse): string {
    let status = '';
    status = statusResponse.isDelivered ? MessageStatus.Delivered : MessageStatus.Sent;
    status = statusResponse.isReaded ? MessageStatus.Readed : status;
    return status;
  }

  public addNotification(login: string): void {
    const userData = this.usersMap.get(login);
    if (!userData) {
      throw new Error(`user is undefined`);
    }
    userData.notifications += 1;
    emitter.emit(EVENT.update_notifications, login, userData.notifications);
  }

  public resetNotifications(): void {
    const userData = this.usersMap.get(this.dialogUser.login);
    if (!userData) {
      throw new Error(`user is undefined`);
    }
    userData.notifications = 0;
    emitter.emit(EVENT.update_notifications, this.dialogUser.login, userData.notifications);
  }

  public setUnreadedMessages(data: Unreaded[]): void {
    data.forEach((msg) => {
      this.unreadEdMap.set(msg.id, msg.from);
    });
  }

  public deleteMessage(msgId: string, responseId: string): void {
    if (state.deleteRequestId === responseId) {
      this.messagesMap.delete(msgId);
      emitter.emit(EVENT.deleted, msgId);
    } else {
      if (this.messagesMap.has(msgId)) {
        this.messagesMap.delete(msgId);
        emitter.emit(EVENT.deleted, msgId);
      }
      if (!this.unreadEdMap.has(msgId)) {
        return;
      }
      const login = this.unreadEdMap.get(msgId);

      if (!login) {
        throw new Error(`login is undefined`);
      }

      this.unreadEdMap.delete(msgId);
      const userData = this.usersMap.get(login);
      if (!userData) {
        throw new Error(`userdata is undefined`);
      }
      userData.notifications -= 1;
      if (userData.notifications === 0 && login === state.dialogUser.login) {
        emitter.emit(EVENT.delete_divider);
      }

      emitter.emit(EVENT.update_notifications, login, userData.notifications);
    }
  }
}

const state = new State();
export default state;
