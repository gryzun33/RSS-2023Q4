import { MessageProps, MessageStatus } from '../../utils/types';
import BaseComponent from './BaseComponent';
import ContextMenu from './ContextMenu';

export default class Message extends BaseComponent {
  protected id: string = '';
  protected text: string = '';

  protected contextMenu?: ContextMenu;
  protected msgText = new BaseComponent({ tag: 'p', classNames: ['msg-text'] });
  protected msgStatus = new BaseComponent({ tag: 'p', classNames: ['msg-status'] });

  protected msgStatusEdited = new BaseComponent({ tag: 'p', classNames: ['msg-edited'] });

  constructor(msg: MessageProps) {
    super({ tag: 'div', classNames: ['message'] });
    this.id = msg.id;
    this.text = msg.text;
    this.createView(msg);
  }

  protected createView(msg: MessageProps): void {
    this.attr('id', msg.id);
    const topInfo = new BaseComponent({ tag: 'div', classNames: ['msg-top-info'] });
    const authorName = msg.author ? 'you' : msg.dialogUser;
    const author = new BaseComponent({ tag: 'p', classNames: ['msg-author'], text: authorName });
    const date = new BaseComponent({ tag: 'p', classNames: ['msg-date'], text: msg.date });
    topInfo.append(author, date);
    this.msgText.setTextContent(msg.text);
    if (msg.isEdited) {
      this.msgStatusEdited.setTextContent(`edited`);
    }
    if (msg.author) {
      this.msgStatus.setTextContent(msg.status);
    }

    const statusBox = new BaseComponent({ tag: 'p', classNames: ['msg-status-box'] });
    statusBox.append(this.msgStatusEdited, this.msgStatus);

    this.append(topInfo, this.msgText, statusBox);
    if (msg.author) {
      this.addClass('message-right');
    } else {
      this.addClass('message-left');
    }
  }

  public setStatusDelivered(): void {
    this.msgStatus.setTextContent(MessageStatus.Delivered);
  }

  public setStatusReaded(): void {
    this.msgStatus.setTextContent(MessageStatus.Readed);
  }

  public setStatusEdited(text: string): void {
    this.msgStatusEdited.setTextContent(MessageStatus.Edited);
    this.msgText.setTextContent(text);
  }
}
