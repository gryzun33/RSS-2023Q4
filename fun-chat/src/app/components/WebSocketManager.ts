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
  };

  onError = (event: Event) => {
    console.error('WebSocket error:', event);

    this.ws?.close();
  };
  send(message: string) {
    this.ws?.send(message);
  }
}
