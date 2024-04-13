import { User } from '../utils/types';
import storage from './Storage';

class State {
  // protected login: string = '';
  // protected password: string = '';

  protected currUser: User = {
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

  public saveUser(user: User) {
    this.currUser = { ...user };
  }

  public getUser(): User {
    return this.currUser;
  }
}

const state = new State();
export default state;
