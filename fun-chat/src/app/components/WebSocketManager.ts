import emitter from './EventEmitter';
import { EVENT } from '../utils/constants';

const URL = 'ws://localhost:4000';
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

  public connect = (): void => {
    this.ws = new WebSocket(URL);
    this.ws.addEventListener('open', this.onOpen);
    this.ws.addEventListener('message', this.onMessage);
    this.ws.addEventListener('close', this.onClose);
    this.ws.addEventListener('error', this.onError);
  };

  public onOpen = (): void => {
    this.isConnect = true;
    emitter.emit(EVENT.connect);
    this.checkAuthorized();
  };

  public onClose = (): void => {
    if (this.isConnect) {
      this.isConnect = false;
      emitter.emit(EVENT.disconnect);
    }
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  };

  public onMessage = (event: MessageEvent): void => {
    const { data } = event;
    this.dataHandler(data);
  };

  public onError = (event: Event): void => {
    console.error('WebSocket error:', event);

    this.ws?.close();
  };
  public send(message: string): void {
    this.ws?.send(message);
  }
}
