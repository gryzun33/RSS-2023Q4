import { MessageProps, MessageStatus } from '../../utils/types';
import BaseComponent from './BaseComponent';
// import emitter from '../EventEmitter';

export default class Message extends BaseComponent {
  protected msgText = new BaseComponent({ tag: 'p', classNames: ['msg-text'] });
  protected msgStatus = new BaseComponent({ tag: 'p', classNames: ['msg-status'] });
  constructor(msg: MessageProps) {
    super({ tag: 'div', classNames: ['message'] });
    this.createView(msg);
  }

  protected createView(msg: MessageProps) {
    this.attr('id', msg.id);
    const topInfo = new BaseComponent({ tag: 'div', classNames: ['msg-top-info'] });
    const authorName = msg.author ? 'you' : msg.dialogUser;
    const author = new BaseComponent({ tag: 'p', classNames: ['msg-author'], text: authorName });
    const date = new BaseComponent({ tag: 'p', classNames: ['msg-date'], text: msg.date });
    topInfo.append(author, date);
    this.msgText.setTextContent(msg.text);
    if (msg.author) {
      this.msgStatus.setTextContent(msg.status);
    }

    this.append(topInfo, this.msgText, this.msgStatus);
    if (msg.author) {
      this.addClass('message-right');
    } else {
      this.addClass('message-left');
    }
  }

  public setStatusDelivered() {
    this.msgStatus.setTextContent(MessageStatus.Delivered);
  }
}
