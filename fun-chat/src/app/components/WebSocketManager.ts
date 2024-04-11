export default class WebSocketManager {
  private ws = new WebSocket('ws://localhost:4000');
  constructor() {
    this.ws.addEventListener('open', this.onOpen);
  }

  onOpen = () => {
    console.log('connected');
    this.ws.addEventListener('message', this.onMessage);
    this.ws.addEventListener('close', this.onClose);
    this.ws.addEventListener('error', this.onError);
  };

  onClose = () => {
    console.log('disconnected');
  };

  onMessage = () => {
    console.log('Message from server:');
  };

  onError = () => {
    console.error('WebSocket error:', Error);
  };
  send(message: string) {
    this.ws.send(message);
  }
}
