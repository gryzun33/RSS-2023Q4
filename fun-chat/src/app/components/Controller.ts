import WebSocketManager from './WebSocketManager';
import emitter from './EventEmitter';

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
  private wsManager = new WebSocketManager();
  constructor() {
    console.log(this.wsManager);
    emitter.on('login', this.authorize);
  }

  protected authorize = () => {
    const request: LoginRequest = {
      id: '1',
      type: 'USER_LOGIN',
      payload: {
        user: {
          login: 'masha',
          password: '2222',
        },
      },
    };

    this.wsManager.send(JSON.stringify(request));
  };
}
