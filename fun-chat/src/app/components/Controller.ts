import WebSocketManager from './WebSocketManager';
import DataHandler from './DataHandler';
import emitter from './EventEmitter';
import state from './State';
import storage from './Storage';

const REQUESTS = {
  login: 'USER_LOGIN',
  logout: 'USER_LOGOUT',
  activeUsers: 'USER_ACTIVE',
  inactiveUsers: 'USER_INACTIVE',
};

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

type UsersRequest = {
  id: string;
  type: string;
  payload: null;
};

export default class Controller {
  private dataHandler = new DataHandler();
  private wsManager?: WebSocketManager;

  constructor() {
    this.wsManager = new WebSocketManager(this.dataHandler.getData, this.checkAuthorized);
    console.log(this.wsManager);
    emitter.on('login', this.loginRequest);
    // emitter.on('login', this.getActiveUsersRequest);
    // emitter.on('login', this.getInactiveUsersRequest);
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
    const loginRequest: LoginRequest = {
      id: requestId,
      type: REQUESTS.login,
      payload: {
        user: {
          login,
          password,
        },
      },
    };

    const activeUsersRequest = this.getUsers(REQUESTS.activeUsers);
    const inactiveUsersRequest = this.getUsers(REQUESTS.inactiveUsers);

    this.wsManager?.send(JSON.stringify(loginRequest));
    this.wsManager?.send(JSON.stringify(activeUsersRequest));
    this.wsManager?.send(JSON.stringify(inactiveUsersRequest));
  };

  protected logoutRequest = () => {
    const { login, password } = state.getUser();
    const requestId = crypto.randomUUID();
    const request: LoginRequest = {
      id: requestId,
      type: REQUESTS.logout,
      payload: {
        user: {
          login,
          password,
        },
      },
    };
    this.wsManager?.send(JSON.stringify(request));
  };

  protected getUsers(status: string): UsersRequest {
    const requestId = crypto.randomUUID();
    return {
      id: requestId,
      type: status,
      payload: null,
    };
  }
}
