import BaseComponent from './BaseComponent';
import { Props, MessageProps, MessageStatus } from '../../utils/types';
import emitter from '../EventEmitter';
import Message from './Message';
import { isMessageProps } from '../../utils/helpers';

enum UserStatus {
  online = 'online',
  offline = 'offline',
}

enum DialogStatus {
  noDialogUser = 'no-dialog-user',
  noMessages = 'no-messages',
  messages = 'messages',
}

export default class Dialog extends BaseComponent {
  protected isDivider: boolean = false;
  protected dialogStatus: string = DialogStatus.noDialogUser;

  protected divider = new BaseComponent({
    tag: 'div',
    classNames: ['divider'],
    text: 'New messages',
  });
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
    emitter.on('add-messages', this.addMessages);
    // this.messages.on('click', () => emitter.emit('setReaded'));
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
    this.dialogUserStatus.setTextContent(status ? UserStatus.online : UserStatus.offline);
    if (!status) {
      this.dialogUserStatus.addClass('status-inactive');
    } else {
      this.dialogUserStatus.removeClass('status-inactive');
    }
  };

  protected addNewMessage = (msg: unknown) => {
    if (!isMessageProps(msg)) {
      throw new Error('type of msg is not MessageProps');
    }

    if (this.dialogStatus === DialogStatus.noDialogUser) {
      return;
    }

    if (this.dialogStatus === DialogStatus.noMessages) {
      this.removePlaceholder();
      if (!msg.author && !this.isDivider) {
        this.showDivider();
      }
    }

    const message = new Message(msg);
    this.messages.append(message);
    this.messages.element.scrollTo({
      top: this.messages.element.scrollHeight,
      behavior: 'smooth',
    });
  };

  protected addMessages = (messages: unknown) => {
    if (!Array.isArray(messages)) {
      throw new Error(`messages is not array`);
    }

    if (messages.length === 0) {
      return;
    }
    this.removePlaceholder();

    messages.forEach((msg: MessageProps) => {
      console.log(msg.status);
      if (!msg.author && msg.status === MessageStatus.Delivered && !this.isDivider) {
        this.showDivider();
      }
      const messageComp = new Message(msg);
      this.messages.append(messageComp);
    });
  };

  protected showDivider = () => {
    this.isDivider = true;
    this.messages.append(this.divider);
    this.divider.removeClass('hidden');
  };

  protected removePlaceholder = () => {
    this.dialogStatus = DialogStatus.messages;
    this.placeholder.addClass('placeholder-hidden');
  };
}
