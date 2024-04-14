import { CurrentUser, UserResponse, User } from '../utils/types';
import storage from './Storage';

// type Users = User[];

class State {
  // protected login: string = '';
  // protected password: string = '';
  public users: User[] = [];
  // public activeUser:User = {};

  protected currUser: CurrentUser = {
    id: '',
    login: '',
    password: '',
  };

  constructor() {
    const user = storage.getData('user');
    if (user) {
      this.currUser.login = user.login;
      this.currUser.password = user.password;
    }
  }

  public saveUser(user: CurrentUser) {
    this.currUser = { ...user };
  }

  public getUser(): CurrentUser {
    return this.currUser;
  }

  public setUsers(data: UserResponse[]) {
    this.users = [...this.users, ...data];
    // console.log('ALLUSERS=', this.users);
  }
}

const state = new State();
export default state;
