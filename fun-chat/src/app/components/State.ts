import { CurrentUser, UserResponse } from '../utils/types';
import storage from './Storage';
import emitter from './EventEmitter';

// type Users = User[];

class State {
  // protected login: string = '';
  // protected password: string = '';
  // public users: User[] = [];
  // public activeUser:User = {};
  public usersMap: Map<string, boolean> = new Map();

  protected currUser: CurrentUser = {
    id: '',
    login: '',
    password: '',
  };

  protected dialogUser: UserResponse = {
    login: '',
    isLogined: true,
  };

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

  public setUsers(data: UserResponse[]) {
    data.forEach((user) => {
      this.usersMap.set(user.login, user.isLogined);
    });

    // this.usersMap = [...this.users, ...data];
    console.log('ALLUSERS=', this.usersMap);
  }

  public changeUserStatus(user: UserResponse) {
    // if (this.usersMap.has(user.login)) {
    this.usersMap.set(user.login, user.isLogined);
    // }
    if (user.isLogined) {
      emitter.emit('external-login', user.login);
    } else {
      emitter.emit('external-logout', user.login);
    }
    if (user.login === this.dialogUser.login) {
      emitter.emit('change-status', user.isLogined);
    }
  }

  public getUserStatus(login: string): boolean {
    const status = this.usersMap.get(login);
    if (!status) {
      throw new Error(`status is undefined`);
    }
    return status;
  }

  public deleteUsers() {
    this.usersMap.clear();
  }

  public setDialogUser(login: string): void {
    const isLogined = this.usersMap.get(login);
    if (isLogined === undefined) {
      throw new Error(`status is undefined`);
    }
    this.dialogUser = {
      login,
      isLogined,
    };
  }

  public getDialogUser(): UserResponse {
    return this.dialogUser;
  }
}

const state = new State();
export default state;
