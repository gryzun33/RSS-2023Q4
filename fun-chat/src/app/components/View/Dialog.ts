import BaseComponent from './BaseComponent';
import { Props, MessageProps } from '../../utils/types';
import emitter from '../EventEmitter';
import Message from './Message';

enum Status {
  online = 'online',
  offline = 'offline',
}

enum DialogStatus {
  noDialogUser = 'no-dialog-user',
  noMessages = 'no-messages',
  messages = 'messages',
}

export default class Dialog extends BaseComponent {
  protected dialogStatus: string = DialogStatus.noDialogUser;
  protected dialogUserLogin = new BaseComponent({ tag: 'p', classNames: ['dialog-user-login'] });
  protected dialogUserStatus = new BaseComponent({ tag: 'p', classNames: ['dialog-user-status'] });
  protected messagesBox = new BaseComponent({ tag: 'div', classNames: ['messages-box'] });
  protected messages = new BaseComponent({ tag: 'div', classNames: ['messages'] });
  protected placeholder = new BaseComponent({
    tag: 'div',
    classNames: ['placeholder'],
    text: `Select a user to send a message to...`,
  });

  constructor(props: Props) {
    super(props);
    this.createView();
    emitter.on('set-dialog-user', this.setDialogUser);
    emitter.on('change-status', this.changeStatus);
    emitter.on('add-message', this.addNewMessage);
  }

  protected createView() {
    const dialogUser = new BaseComponent({ tag: 'div', classNames: ['dialog-user'] });
    dialogUser.append(this.dialogUserLogin, this.dialogUserStatus);

    this.messagesBox.append(this.placeholder, this.messages);
    this.append(dialogUser, this.messagesBox);
  }

  protected setDialogUser = (login: unknown, status: unknown) => {
    console.log('setUSER');
    if (typeof login !== 'string' || typeof status !== 'boolean') {
      throw new Error(`login or status does not match type `);
    }
    this.dialogUserLogin.setTextContent(login);

    // if (!status) {
    //   this.dialogUserStatus.addClass('status-inactive');
    // } else {
    //   this.dialogUserStatus.removeClass('status-inactive');
    // }
    this.changeStatus(status);
    // this.enableInput();
    this.changePlaceholder();

    this.dialogStatus = DialogStatus.noMessages;
  };

  protected changePlaceholder = () => {
    this.placeholder.setTextContent(`Please write your first message...`);
  };

  protected changeStatus = (status: unknown) => {
    if (typeof status !== 'boolean') {
      throw new Error(`status isn't boolean`);
    }
    this.dialogUserStatus.setTextContent(status ? Status.online : Status.offline);
    if (!status) {
      this.dialogUserStatus.addClass('status-inactive');
    } else {
      this.dialogUserStatus.removeClass('status-inactive');
    }
  };

  protected addNewMessage = (msg: unknown) => {
    if (this.dialogStatus === DialogStatus.noDialogUser) {
      return;
    }

    if (this.dialogStatus === DialogStatus.noMessages) {
      this.dialogStatus = DialogStatus.messages;
      this.placeholder.addClass('placeholder-hidden');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function isMessageProps(obj: any): obj is MessageProps {
      return (
        typeof obj === 'object' &&
        typeof obj.id === 'string' &&
        typeof obj.text === 'string' &&
        typeof obj.status === 'string' &&
        typeof obj.date === 'string' &&
        typeof obj.author === 'boolean' &&
        typeof obj.dialogUser === 'string'
      );
    }

    if (!isMessageProps(msg)) {
      throw new Error('type of msg is not MessageProps');
    }

    const message = new Message(msg);
    this.messages.append(message);
    this.messages.element.scrollTo({
      top: this.messages.element.scrollHeight,
      behavior: 'smooth',
    });
  };
}
