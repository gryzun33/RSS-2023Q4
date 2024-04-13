// import storage from "./Storage";

type Handler = (arg: string) => void;

export default class WebSocketManager {
  private ws = new WebSocket('ws://localhost:4000');
  constructor(
    public dataHandler: Handler,
    public checkAuthorized: () => void
  ) {
    this.ws.addEventListener('open', this.onOpen);
  }

  onOpen = () => {
    console.log('connected');
    this.ws.addEventListener('message', this.onMessage);
    this.ws.addEventListener('close', this.onClose);
    this.ws.addEventListener('error', this.onError);

    this.checkAuthorized();
  };

  onClose = () => {
    console.log('disconnected');
  };

  onMessage = (event: MessageEvent) => {
    const { data } = event;
    this.dataHandler(data);
    console.log('Message from server:', event.data);
  };

  onError = (event: Event) => {
    console.error('WebSocket error:', event);
  };
  send(message: string) {
    console.log('send', message);
    this.ws.send(message);
  }
}
