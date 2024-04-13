import WebSocketManager from './WebSocketManager';
import DataHandler from './DataHandler';
import emitter from './EventEmitter';
import state from './State';
import storage from './Storage';

type LoginRequest = {
  id: string;
  type: string;
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
};

export default class Controller {
  private dataHandler = new DataHandler();
  private wsManager?: WebSocketManager;

  constructor() {
    this.wsManager = new WebSocketManager(this.dataHandler.getData, this.checkAuthorized);
    console.log(this.wsManager);
    emitter.on('login', this.loginRequest);
    emitter.on('logout', this.logoutRequest);
  }

  public checkAuthorized = () => {
    const user = storage.getData('user');
    if (user) {
      console.log('userfromstorage=', user);
      const { login, password } = user;
      this.loginRequest(login, password);
    }
  };

  protected loginRequest = (login: unknown, password: unknown) => {
    if (typeof login !== 'string' || typeof password !== 'string') {
      throw new Error('login or password is not string');
    }
    console.log('authorize');
    const requestId = crypto.randomUUID();
    state.saveUser({ id: requestId, login, password });
    const request: LoginRequest = {
      id: requestId,
      type: 'USER_LOGIN',
      payload: {
        user: {
          login,
          password,
        },
      },
    };

    this.wsManager?.send(JSON.stringify(request));
  };

  protected logoutRequest = () => {
    const { login, password } = state.getUser();
    const requestId = crypto.randomUUID();
    const request: LoginRequest = {
      id: requestId,
      type: 'USER_LOGOUT',
      payload: {
        user: {
          login,
          password,
        },
      },
    };
    this.wsManager?.send(JSON.stringify(request));
  };
}
