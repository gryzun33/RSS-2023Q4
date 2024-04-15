import emitter from './EventEmitter';
import storage from './Storage';
import state from './State';
import ErrorHandler from './ErrorHandler';
import { UserResponse } from '../utils/types';

// type MessageResponse = {
//   id: string,
//   from: string,
//   to: string,
//   text: string,
//   datetime: number,
//   status: {
//     isDelivered: boolean,
//     isReaded: boolean,
//     isEdited: boolean,
//   }
// }

export default class DataHandler {
  protected errorHandler = new ErrorHandler();

  public getData = (dataStr: string) => {
    const data = JSON.parse(dataStr);
    console.log('data=', data);

    switch (data.type) {
      case 'USER_LOGIN':
        // console.log('userlogin');
        this.authorize(data.payload.user, data.id);
        break;
      case 'USER_LOGOUT':
        // console.log('userlogout');
        this.logoutResponse(data.payload.user);
        break;
      case 'USER_EXTERNAL_LOGIN':
        // console.log('userexternallogin');
        // this.externalLogin(data.payload.user);
        emitter.emit('external-login', data.payload.user.login);
        break;
      case 'USER_EXTERNAL_LOGOUT':
        // console.log('userexternallogout');
        // this.externalLogout(data.payload.user);
        emitter.emit('external-logout', data.payload.user.login);
        break;
      case 'USER_ACTIVE':
        // console.log('useractive');
        this.usersResponse(data.payload.users, data.type);
        break;
      case 'USER_INACTIVE':
        // console.log('userinactive');
        this.usersResponse(data.payload.users, data.type);
        break;
      case 'MSG_SEND':
        console.log('userlogout');
        break;
      case 'MSG_FROM_USER':
        console.log('userlogout');
        break;
      case 'MSG_DELIVER':
        console.log('userlogout');
        break;
      case 'MSG_READ':
        console.log('userlogout');
        break;
      case 'MSG_EDIT':
        console.log('userlogout');
        break;
      case 'ERROR':
        this.errorHandler.onError(data.payload.error);
        // console.log(data.payload.error);
        break;

      default:
        console.error('unknown type');
        break;
    }
  };

  private authorize(user: UserResponse, idResponse: string) {
    if (user.isLogined) {
      const { id, login, password } = state.getUser();
      if (idResponse === id) {
        storage.saveData('user', { login, password });
        let path = window.location.pathname.slice(1);
        path = path === 'about' ? 'about' : 'main';
        emitter.emit('navigate', path);
      }
    }
  }

  private logoutResponse(user: UserResponse) {
    if (!user.isLogined) {
      storage.removeStorage();
      emitter.emit('navigate', 'login');
    }
  }

  private usersResponse(users: UserResponse[], type: string) {
    if (type === 'USER_ACTIVE') {
      const { login } = state.getUser();
      const usersWithoutCurrent: UserResponse[] = users.filter((user) => user.login !== login);
      state.setUsers(usersWithoutCurrent);
      emitter.emit('addUsersToList', usersWithoutCurrent);
      return;
    }
    state.setUsers(users);
    emitter.emit('addUsersToList', users);
  }
}
