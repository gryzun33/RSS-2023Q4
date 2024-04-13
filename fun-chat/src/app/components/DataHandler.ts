import emitter from './EventEmitter';
import storage from './Storage';
import state from './State';
import ErrorHandler from './ErrorHandler';

type LoginResponse = {
  login: string;
  isLogined: boolean;
};

export default class DataHandler {
  protected errorHandler = new ErrorHandler();

  public getData = (dataStr: string) => {
    const data = JSON.parse(dataStr);
    console.log('data=', data);

    switch (data.type) {
      case 'USER_LOGIN':
        console.log('userlogin');
        this.authorize(data.payload.user, data.id);
        break;
      case 'USER_LOGOUT':
        console.log('userlogout');
        this.logoutResponse(data.payload.user);
        break;
      case 'USER_EXTERNAL_LOGIN':
        console.log('userlogout');
        break;
      case 'USER_EXTERNAL_LOGOUT':
        console.log('userlogout');
        break;
      case 'USER_ACTIVE':
        console.log('userlogout');
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
        console.log(data.payload.error);
        break;

      default:
        console.log('unknown type');
        break;
    }
  };

  private authorize(user: LoginResponse, idResponse: string) {
    if (user.isLogined) {
      const { id, login, password } = state.getUser();
      if (idResponse === id) {
        storage.saveData('user', { login, password });
        emitter.emit('navigate', 'main');
      }
    }
  }

  private logoutResponse(user: LoginResponse) {
    if (!user.isLogined) {
      storage.removeStorage();
      emitter.emit('navigate', 'login');
    }
  }
}
