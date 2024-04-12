import { User } from '../utils/types';

class State {
  // protected login: string = '';
  // protected password: string = '';

  protected currUser: User = {
    id: '',
    login: '',
    password: '',
  };

  public saveUser(user: User) {
    this.currUser = { ...user };
  }

  public getUser(): User {
    return this.currUser;
  }
}

const state = new State();
export default state;
