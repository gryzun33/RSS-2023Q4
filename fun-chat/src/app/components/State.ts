import { CurrentUser, UserResponse, MessageResponse, MessageStatus } from '../utils/types';
import storage from './Storage';
import emitter from './EventEmitter';
import { formatDate } from '../utils/helpers';

// type Users = User[];

type UserData = {
  notifications: number;
  isLogined: boolean;
};

// enum Status {
//   Sent = 'sent',
//   Delivered = 'delivered',
//   Readed = 'readed',
//   Edited = 'edited',
// }

type StatusResponse = {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
};

class State {
  // protected login: string = '';
  // protected password: string = '';
  // public users: User[] = [];
  // public activeUser:User = {};
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

  constructor() {
    const user = storage.getData('user');
    if (user) {
      this.currUser.login = user.login;
      this.currUser.password = user.password;
    }
  }

  public updateState() {
    this.deleteUsers();
    this.dialogUser = { login: '', isLogined: true };
  }

  public saveUser(user: CurrentUser) {
    this.currUser = { ...user };
  }

  public getUser(): CurrentUser {
    return this.currUser;
  }

  // public setUsers(data: UserResponse[]) {
  //   data.forEach((user) => {
  //     this.usersMap.set(user.login, user.isLogined);
  //   });

  //   console.log('ALLUSERS=', this.usersMap);
  // }

  public changeUserStatus(user: UserResponse) {
    // if (this.usersMap.has(user.login)) {
    // this.usersMap.set(user.login, {notifi});
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

    // emitter.emit('draw-notifications', login, userData.notifications);
  }

  // public getUserStatus(login: string): boolean {
  //   const status = this.usersMap.get(login);
  //   if (!status) {
  //     throw new Error(`status is undefined`);
  //   }
  //   return status;
  // }

  public deleteUsers() {
    this.usersMap.clear();
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
    console.log('msg98=', msg);
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
    };
    emitter.emit('add-message', msgProps);
    if (!author) {
      state.addNotification(msg.from);
    }
  }

  public addMessages(msgs: MessageResponse[]) {
    this.messagesMap.clear();
    const messages = msgs.map((msg) => {
      const author = msg.from === this.currUser.login;
      const dialogUser = msg.from;
      const date = formatDate(msg.datetime);
      const status = this.getStatus(msg.status);

      return {
        id: msg.id,
        author,
        dialogUser,
        date,
        status,
        text: msg.text,
      };
    });
    emitter.emit('add-messages', messages);
  }

  protected getStatus(statusResponse: StatusResponse): string {
    let status = '';
    status = statusResponse.isDelivered ? MessageStatus.Delivered : MessageStatus.Sent;
    status = statusResponse.isReaded ? MessageStatus.Readed : status;
    status = statusResponse.isEdited ? MessageStatus.Edited : status;
    return status;
  }

  public addNotification(login: string) {
    const userData = this.usersMap.get(login);
    if (!userData) {
      throw new Error(`user is undefined`);
    }
    userData.notifications += 1;
    console.log('login=', login);
    console.log('number=', userData.notifications);
    emitter.emit('update-notifications', login, userData.notifications);
  }
}

const state = new State();
export default state;
