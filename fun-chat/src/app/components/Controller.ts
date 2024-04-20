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
  msgFromUser: 'MSG_FROM_USER',
  messSend: 'MSG_SEND',
  messRead: 'MSG_READ',
  messEdit: 'MSG_EDIT',
  messDelete: 'MSG_DELETE',
};

type MsgStatusRequest = {
  id: string | null;
  type: string;
  payload: {
    message: {
      id: string;
    };
  };
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

type MsgEditRequest = {
  id: string;
  type: string;
  payload: {
    message: {
      id: string;
      text: string;
    };
  };
};

type MsgDeleteRequest = {
  id: string;
  type: string;
  payload: {
    message: {
      id: string;
    };
  };
};

export default class Controller {
  private dataHandler = new DataHandler();
  private wsManager?: WebSocketManager;

  constructor() {
    this.wsManager = new WebSocketManager(this.dataHandler.getData, this.checkAuthorized);
    emitter.on('login', this.loginRequest);
    emitter.on('logout', this.logoutRequest);
    emitter.on('send-message', this.sendRequest);
    emitter.on('set-dialog-user', this.dialogUserRequset);
    emitter.on('get-notifications', this.notificationsRequest);
    emitter.on('set-readed', this.readedRequest);
    emitter.on('edit-message', this.editRequest);
    emitter.on('delete-message', this.deleteRequest);
  }

  public checkAuthorized = () => {
    state.updateState();
    const user = storage.getData('user');
    if (user) {
      const { login, password } = user;
      this.loginRequest(login, password);
    }
  };

  protected loginRequest = (login: unknown, password: unknown) => {
    if (typeof login !== 'string' || typeof password !== 'string') {
      throw new Error('login or password is not string');
    }
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

    this.wsManager?.send(JSON.stringify(loginRequest));
    this.externalUsersRequest();
  };

  public externalUsersRequest() {
    const activeUsersRequest = this.getUsers(REQUESTS.activeUsers);
    const inactiveUsersRequest = this.getUsers(REQUESTS.inactiveUsers);
    this.wsManager?.send(JSON.stringify(activeUsersRequest));
    this.wsManager?.send(JSON.stringify(inactiveUsersRequest));
  }

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
    this.notificationsDialogRequest(login);
  };

  protected notificationsDialogRequest = (login: string) => {
    const requestId = crypto.randomUUID();
    state.dialogId = requestId;
    const request = {
      id: state.dialogId,
      type: REQUESTS.msgFromUser,
      payload: {
        user: {
          login,
        },
      },
    };
    this.wsManager?.send(JSON.stringify(request));
  };

  protected notificationsRequest = (login: unknown) => {
    if (typeof login !== 'string') {
      throw new Error(`login isnt't string`);
    }

    const request = {
      id: login,
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

  protected readedRequest = () => {
    const messages = Array.from(state.messagesMap.values());
    const messagesId = messages.filter((msg) => !msg.status.isReaded).map((msg) => msg.id);

    messagesId.forEach((id) => {
      const request: MsgStatusRequest = {
        id: '',
        type: REQUESTS.messRead,
        payload: {
          message: {
            id,
          },
        },
      };
      this.wsManager?.send(JSON.stringify(request));
    });

    state.resetNotifications();
  };

  protected editRequest = (text: unknown) => {
    if (typeof text !== 'string') {
      throw new Error(`text is not string`);
    }
    const { id } = state.getEditedMsg();
    const request: MsgEditRequest = {
      id: '',
      type: REQUESTS.messEdit,
      payload: {
        message: {
          id,
          text,
        },
      },
    };

    this.wsManager?.send(JSON.stringify(request));
  };

  protected deleteRequest = (id: unknown) => {
    if (typeof id !== 'string') {
      throw new Error(`id is not string`);
    }

    const request: MsgDeleteRequest = {
      id: '',
      type: REQUESTS.messDelete,
      payload: {
        message: {
          id,
        },
      },
    };
    this.wsManager?.send(JSON.stringify(request));
  };
}
