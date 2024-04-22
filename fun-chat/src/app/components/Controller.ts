import WebSocketManager from './WebSocketManager';
import DataHandler from './DataHandler';
import emitter from './EventEmitter';
import state from './State';
import storage from './Storage';
import {
  MsgStatusRequest,
  LoginRequest,
  UsersRequest,
  MessageRequest,
  MsgEditRequest,
  MsgDeleteRequest,
} from '../utils/typesRequests';
import { EVENT, REQUESTS } from '../utils/constants';

export default class Controller {
  private dataHandler = new DataHandler();
  private wsManager?: WebSocketManager;

  constructor() {
    this.wsManager = new WebSocketManager(this.dataHandler.getData, this.checkAuthorized);
    emitter.on(EVENT.login, this.loginRequest);
    emitter.on(EVENT.logout, this.logoutRequest);
    emitter.on(EVENT.send_message, this.sendRequest);
    emitter.on(EVENT.set_dialog_user, this.dialogUserRequset);
    emitter.on(EVENT.get_notifications, this.notificationsRequest);
    emitter.on(EVENT.set_readed, this.readedRequest);
    emitter.on(EVENT.edit_message, this.editRequest);
    emitter.on(EVENT.delete_message, this.deleteRequest);
  }

  public checkAuthorized = (): void => {
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

    const requestId = crypto.randomUUID();
    state.deleteRequestId = requestId;
    const request: MsgDeleteRequest = {
      id: requestId,
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
