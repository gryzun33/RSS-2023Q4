import emitter from './EventEmitter';
import storage from './Storage';
import state from './State';
import ErrorHandler from './ErrorHandler';
import { UserResponse, MessageResponse } from '../utils/types';

type DeliveredResponse = {
  id: string;
  status: {
    isDelivered: boolean;
  };
};

type ReadedResponse = {
  id: string;
  status: {
    isReaded: boolean;
  };
};

export default class DataHandler {
  protected errorHandler = new ErrorHandler();

  public getData = (dataStr: string) => {
    const data = JSON.parse(dataStr);
    // console.log('data=', data);

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
        this.userStatusResponse(data.payload.user);

        break;
      case 'USER_EXTERNAL_LOGOUT':
        // console.log('userexternallogout');
        this.userStatusResponse(data.payload.user);
        // emitter.emit('external-logout', data.payload.user.login);
        break;
      case 'USER_ACTIVE':
        // console.log('useractive');
        this.usersResponse(data.payload.users);
        break;
      case 'USER_INACTIVE':
        // console.log('userinactive');
        this.usersResponse(data.payload.users);
        break;
      case 'MSG_SEND':
        console.log('MSG-SENT-RESPONSE');
        console.log('msg=', data.payload);
        this.messageResponse(data.payload.message);

        break;
      case 'MSG_FROM_USER':
        // console.log('MSGFROMUSER');
        // console.log('all=', data);
        this.messagesResponse(data.payload.messages, data.id);

        break;
      case 'MSG_DELIVER':
        console.log('deliver');
        this.deliverResponse(data.payload.message);

        break;
      case 'MSG_READ':
        console.log('REAAAD');
        this.readResponse(data.payload.message);
        break;
      case 'MSG_EDIT':
        console.log('edit');
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

  private usersResponse(users: UserResponse[]) {
    // if (type === 'USER_ACTIVE') {
    //
    //   const usersWithoutCurrent: UserResponse[] = users.filter((user) => user.login !== login);
    //   state.setUsers(usersWithoutCurrent);
    //   emitter.emit('addUsersToList', usersWithoutCurrent);
    //   return;
    // }
    // state.setUsers(users);
    // emitter.emit('addUsersToList', users);
    // state.setUsers(users);
    const { login } = state.getUser();
    users.forEach((user) => {
      if (user.login !== login) {
        emitter.emit('get-notifications', user.login);
        state.changeUserStatus(user);
      }
    });
  }

  private userStatusResponse(user: UserResponse) {
    emitter.emit('get-notifications', user.login);
    state.changeUserStatus(user);
  }

  private messageResponse = (msg: MessageResponse) => {
    state.addMessage(msg);
  };

  protected messagesResponse = (msgs: MessageResponse[], id: string) => {
    if (id === state.dialogId) {
      state.addMessages(msgs);
      return;
    }

    const { login } = state.getUser();
    const unReaded = msgs.filter((msg) => msg.from !== login && !msg.status.isReaded);
    // console.log('unreaded=', unReaded);
    const notifications = unReaded.length;
    state.setNotifications(id, notifications);
  };

  protected deliverResponse(data: DeliveredResponse) {
    const msg = state.messagesMap.get(data.id);
    if (!msg) {
      throw new Error(`message is undefined`);
    }
    msg.status.isDelivered = true;
    emitter.emit('delivered', data.id);
  }

  protected readResponse(data: ReadedResponse) {
    const msg = state.messagesMap.get(data.id);
    const { login } = state.getDialogUser();
    if (!msg) {
      // throw new Error(`message is undefined`);
      return;
    }
    msg.status.isReaded = true;
    if (login !== msg.from) {
      emitter.emit('readed', data.id);
    }
  }
}
