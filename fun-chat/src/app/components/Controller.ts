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
  messSend: 'MSG_SEND',
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

type MessageRequest = {
  id: string | null;
  type: string;
  payload: {
    message: {
      to: string;
      text: string;
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
    // emitter.on('login', this.getActiveUsersRequest);
    // emitter.on('login', this.getInactiveUsersRequest);
    emitter.on('logout', this.logoutRequest);
    emitter.on('send-message', this.sendRequest);
    emitter.on('set-dialog-user', this.dialogUserRequset);
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

  protected dialogUserRequset = (login: unknown) => {
    if (typeof login !== 'string') {
      throw new Error(`login isnt't string`);
    }
    state.setDialogUser(login);

    const request = {
      id: null,
      type: 'MSG_FROM_USER',
      payload: {
        user: {
          login,
        },
      },
    };
    this.wsManager?.send(JSON.stringify(request));
  };

  protected sendRequest = (message: unknown) => {
    if (typeof message !== 'string') {
      throw new Error(`login isnt't string`);
    }
    const dialogUser = state.getDialogUser();
    const request: MessageRequest = {
      id: null,
      type: REQUESTS.messSend,
      payload: {
        message: {
          to: dialogUser.login,
          text: message,
        },
      },
    };
    this.wsManager?.send(JSON.stringify(request));
  };
}
