import emitter from './EventEmitter';
import storage from './Storage';
import state from './State';
import ErrorHandler from './ErrorHandler';
import {
  UserResponse,
  MessageResponse,
  DeliveredResponse,
  ReadedResponse,
  EditResponse,
  DeleteResponse,
} from '../utils/typesResponses';
import { EVENT } from '../utils/constants';

export default class DataHandler {
  protected errorHandler = new ErrorHandler();

  public getData = (dataStr: string): void => {
    const data = JSON.parse(dataStr);

    switch (data.type) {
      case 'USER_LOGIN':
        this.authorize(data.payload.user, data.id);
        break;
      case 'USER_LOGOUT':
        this.logoutResponse(data.payload.user);
        break;
      case 'USER_EXTERNAL_LOGIN':
        this.userStatusResponse(data.payload.user);
        break;
      case 'USER_EXTERNAL_LOGOUT':
        this.userStatusResponse(data.payload.user);
        break;
      case 'USER_ACTIVE':
        this.usersResponse(data.payload.users);
        break;
      case 'USER_INACTIVE':
        this.usersResponse(data.payload.users);
        break;
      case 'MSG_SEND':
        this.messageResponse(data.payload.message);
        break;
      case 'MSG_FROM_USER':
        this.messagesResponse(data.payload.messages, data.id);
        break;
      case 'MSG_DELIVER':
        this.deliverResponse(data.payload.message);
        break;
      case 'MSG_READ':
        this.readResponse(data.payload.message);
        break;
      case 'MSG_EDIT':
        this.editResponse(data.payload.message);
        break;
      case 'MSG_DELETE':
        this.deleteResponse(data.payload.message, data.id);
        break;
      case 'ERROR':
        this.errorHandler.onError(data.payload.error);
        break;
      default:
        console.error('unknown type');
        break;
    }
  };

  private authorize(user: UserResponse, idResponse: string): void {
    if (user.isLogined) {
      const { id, login, password } = state.getUser();
      if (idResponse === id) {
        storage.saveData('user', { login, password });
        let path = window.location.pathname.slice(1);
        path = path === 'about' ? 'about' : 'main';
        emitter.emit(EVENT.navigate, path);
      }
    }
  }

  private logoutResponse(user: UserResponse): void {
    if (!user.isLogined) {
      storage.removeStorage();
      emitter.emit(EVENT.navigate, 'login');
    }
  }

  private usersResponse(users: UserResponse[]): void {
    const { login } = state.getUser();
    users.forEach((user) => {
      if (user.login !== login) {
        emitter.emit(EVENT.get_notifications, user.login);
        state.changeUserStatus(user);
      }
    });
  }

  private userStatusResponse(user: UserResponse): void {
    emitter.emit(EVENT.get_notifications, user.login);
    state.changeUserStatus(user);
  }

  private messageResponse = (msg: MessageResponse): void => {
    state.addMessage(msg);
  };

  protected messagesResponse = (msgs: MessageResponse[], id: string): void => {
    if (id === state.dialogId) {
      state.addMessages(msgs);
      return;
    }

    const { login } = state.getUser();
    const unReaded = msgs.filter((msg) => msg.from !== login && !msg.status.isReaded);
    const unreadedData = unReaded.map((msg) => {
      const data = {
        id: msg.id,
        from: msg.from,
      };
      return data;
    });
    const notifications = unReaded.length;
    state.setNotifications(id, notifications);
    state.setUnreadedMessage(unreadedData);
  };

  protected deliverResponse(data: DeliveredResponse): void {
    const msg = state.messagesMap.get(data.id);
    if (!msg) {
      throw new Error(`message is undefined`);
    }
    msg.status.isDelivered = true;
    emitter.emit(EVENT.delivered, data.id);
  }

  protected readResponse(data: ReadedResponse): void {
    const msg = state.messagesMap.get(data.id);
    const { login } = state.getDialogUser();
    if (!msg) {
      return;
    }
    msg.status.isReaded = true;
    state.unreadEdMap.delete(data.id);
    if (login !== msg.from) {
      emitter.emit(EVENT.readed, data.id);
    }
  }

  protected editResponse(data: EditResponse): void {
    const msg = state.messagesMap.get(data.id);
    if (!msg) {
      throw new Error(`message is undefined`);
    }
    msg.status.isEdited = true;
    msg.text = data.text;
    emitter.emit(EVENT.edited, data.id, data.text);
  }

  protected deleteResponse(data: DeleteResponse, id: string): void {
    state.deleteMessage(data.id, id);
  }
}
