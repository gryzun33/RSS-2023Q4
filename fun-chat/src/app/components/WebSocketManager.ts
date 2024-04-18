// import storage from "./Storage";

import emitter from './EventEmitter';

type Handler = (arg: string) => void;
export default class WebSocketManager {
  private ws?: WebSocket;
  protected reconnectInterval: number = 1000;

  protected isConnect: boolean = true;
  constructor(
    public dataHandler: Handler,
    public checkAuthorized: () => void
  ) {
    this.connect();
  }

  connect = () => {
    this.ws = new WebSocket('ws://localhost:4000');
    this.ws.addEventListener('open', this.onOpen);
    this.ws.addEventListener('message', this.onMessage);
    this.ws.addEventListener('close', this.onClose);
    this.ws.addEventListener('error', this.onError);
  };

  onOpen = () => {
    this.isConnect = true;
    emitter.emit('connect');
    this.checkAuthorized();
  };

  onClose = () => {
    if (this.isConnect) {
      this.isConnect = false;
      emitter.emit('disconnect');
    }
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  };

  onMessage = (event: MessageEvent) => {
    const { data } = event;
    this.dataHandler(data);
    // console.log('Message from server:', event.data);
  };

  onError = (event: Event) => {
    console.error('WebSocket error:', event);

    this.ws?.close();
  };
  send(message: string) {
    console.log('send', message);
    this.ws?.send(message);
  }
}

// export default class WebSocketManager {
//   private ws = new WebSocket('ws://localhost:4000');
//   constructor(
//     public dataHandler: Handler,
//     public checkAuthorized: () => void
//   ) {
//     this.ws.addEventListener('open', this.onOpen);
//   }

//   onOpen = () => {
//     console.log('connected');
//     this.ws.addEventListener('message', this.onMessage);
//     this.ws.addEventListener('close', this.onClose);
//     this.ws.addEventListener('error', this.onError);

//     this.checkAuthorized();
//   };

//   onClose = () => {
//     console.log('disconnected');
//   };

//   onMessage = (event: MessageEvent) => {
//     const { data } = event;
//     this.dataHandler(data);
//     console.log('Message from server:', event.data);
//   };

//   onError = (event: Event) => {
//     console.error('WebSocket error:', event);
//   };
//   send(message: string) {
//     console.log('send', message);
//     this.ws.send(message);
//   }
// }

// export default class WebSocketManager {
//   private ws = new WebSocket('ws://localhost:4000');
//   protected reconnectInterval: number = 1000;
//   protected reconnectIntervalId?: number;
//   constructor(
//     public dataHandler: Handler,
//     public checkAuthorized: () => void
//   ) {
//     this.ws.addEventListener('open', this.onOpen);
//     this.ws.addEventListener('message', this.onMessage);
//     this.ws.addEventListener('close', this.onClose);
//     this.ws.addEventListener('error', this.onError);
//   }

//   onOpen = () => {
//     console.log('connected');
//     console.log('readystate=', this.ws.readyState);
//     if (this.ws.readyState !== WebSocket.OPEN) {
//       return;
//     }
//     clearInterval(this.reconnectIntervalId);
//     console.log('clearinterval');
//     this.checkAuthorized();
//   };

//   onClose = () => {
//     console.log('disconnected');
//     this.reconnect();
//   };

//   onMessage = (event: MessageEvent) => {
//     const { data } = event;
//     this.dataHandler(data);
//     console.log('Message from server:', event.data);
//   };

//   onError = (event: Event) => {
//     console.error('WebSocket error:', event);
//     // this.onClose();
//   };
//   send(message: string) {
//     console.log('send', message);
//     this.ws.send(message);
//   }

//   reconnect = () => {
//     this.reconnectIntervalId = setInterval(() => {
//       this.ws = new WebSocket('ws://localhost:4000');
//       console.log('readystate=', this.ws.readyState);
//     }, this.reconnectInterval);
//   };
// }
