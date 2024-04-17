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
  protected messagesMap: Map<string, Message> = new Map();
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
    emitter.on('delivered', this.setStatusDelivered);
    emitter.on('readed', this.setStatusReaded);
    this.messages.on('click', this.onClickMessages);
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
    }
    if (!msg.author && !this.isDivider) {
      // this.isDivider = true;
      this.showDivider();
    }

    this.addMessage(msg);
    this.scrollMessages();
    // this.messages.element.scrollTo({
    //   top: this.messages.element.scrollHeight,
    //   behavior: 'smooth',
    // });
  };

  protected addMessages = (messages: unknown) => {
    if (!Array.isArray(messages)) {
      throw new Error(`messages is not array`);
    }

    this.destroyMessages();

    if (messages.length === 0) {
      return;
    }
    this.removePlaceholder();

    messages.forEach((msg: MessageProps) => {
      console.log(msg.status);
      if (!msg.author && msg.status === MessageStatus.Delivered && !this.isDivider) {
        this.showDivider();
      }
      this.addMessage(msg);
      // const messageComp = new Message(msg);
      // this.messages.append(messageComp);
    });
    this.scrollMessages();
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

  protected addMessage(msg: MessageProps) {
    const messageComp = new Message(msg);
    this.messages.append(messageComp);
    this.messagesMap.set(msg.id, messageComp);
  }

  protected setStatusDelivered = (id: unknown) => {
    if (typeof id !== 'string') {
      throw new Error(`id is not string`);
    }
    const messageComp = this.messagesMap.get(id);
    if (!messageComp) {
      throw new Error(`messageComponent is undefined`);
    }
    messageComp.setStatusDelivered();
  };

  protected setStatusReaded = (id: unknown) => {
    if (typeof id !== 'string') {
      throw new Error(`id is not string`);
    }
    const messageComp = this.messagesMap.get(id);
    if (!messageComp) {
      throw new Error(`messageComponent is undefined`);
    }
    messageComp.setStatusReaded();
  };

  protected destroyMessages = () => {
    // const messages = this.messagesMap.values();
    this.messagesMap.forEach((message) => {
      message.destroy();
    });
    this.messagesMap.clear();
    this.hideDivider();
  };

  protected hideDivider = () => {
    this.isDivider = false;
    this.divider.addClass('hidden');
  };

  protected onClickMessages = () => {
    this.hideDivider();
    emitter.emit('set-readed');
  };

  public scrollMessages() {
    // if (!container || !divider) return;
    const container = this.messages.element;
    const divider = this.divider.element;

    if (this.isDivider) {
      const containerRect = container.getBoundingClientRect();
      const dividerRect = divider.getBoundingClientRect();

      const remainingHeight = container.scrollHeight - container.clientHeight;
      if (dividerRect.top >= containerRect.top && remainingHeight > containerRect.height) {
        container.scrollTo({
          top: container.scrollTop + (dividerRect.top - containerRect.top) - 10,
          behavior: 'smooth',
        });
      }
    } else {
      const isScrollable = container.scrollHeight > container.clientHeight;
      if (isScrollable) {
        container.scrollTo({
          top: container.scrollHeight - container.clientHeight,
          behavior: 'smooth',
        });
      }
    }
  }
}
