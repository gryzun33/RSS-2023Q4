import BaseComponent from './BaseComponent';
import { Props, MessageProps, MessageStatus } from '../../utils/types';
import emitter from '../EventEmitter';
import Message from './Message';
import { isMessageProps } from '../../utils/helpers';
// import { Listener } from '../../utils/types';

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
  protected isProgrammScroll: boolean = false;
  protected dialogStatus: string = DialogStatus.noDialogUser;

  // protected emitterMap: Map<string, Listener> = new Map([[]]);
  protected divider = new BaseComponent({
    tag: 'div',
    classNames: ['divider'],
    text: 'New messages',
  });
  protected dialogUserLogin = new BaseComponent({ tag: 'p', classNames: ['dialog-user-login'] });
  protected dialogUserStatus = new BaseComponent({
    tag: 'p',
    classNames: ['dialog-user-status'],
    text: ``,
  });
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
    // emitter.on('set-dialog-user', this.setDialogUser);
    // emitter.on('change-status', this.changeStatus);
    // emitter.on('add-message', this.addNewMessage);
    // emitter.on('add-messages', this.addMessages);
    // emitter.on('delivered', this.setStatusDelivered);
    // emitter.on('readed', this.setStatusReaded);
    // emitter.on('send-message', this.onChangeMessages);
    this.messages.on('click', this.onChangeMessages);
    this.messages.on('scroll', this.onScrollMessages);
    this.messages.on('scrollend', this.onScrollEndHandler);

    this.emitterMap = new Map([
      ['set-dialog-user', this.setDialogUser],
      ['change-status', this.changeStatus],
      ['add-message', this.addNewMessage],
      ['add-messages', this.addMessages],
      ['delivered', this.setStatusDelivered],
      ['readed', this.setStatusReaded],
      ['send-message', this.onChangeMessages],
    ]);
    this.emitterMap.forEach((listener, eventName) => {
      this.unsubscribes.push(emitter.on(eventName, listener));
    });
    console.log('unubscribes', this.unsubscribes);
  }

  protected createView() {
    const dialogUser = new BaseComponent({ tag: 'div', classNames: ['dialog-user'] });
    dialogUser.append(this.dialogUserLogin, this.dialogUserStatus);

    this.messagesBox.append(this.placeholder, this.messages);
    this.append(dialogUser, this.messagesBox);
  }

  protected onScrollEndHandler = () => {
    if (this.isProgrammScroll) {
      this.isProgrammScroll = false;
    }
  };

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
    this.placeholder.removeClass('placeholder-hidden');
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
    this.scrollMessages(true);
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
    this.scrollMessages(false);
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

  protected onChangeMessages = () => {
    // if (this.isProgrammScroll) {
    //   this.isProgrammScroll = false;
    // }
    if (this.isDivider) {
      this.hideDivider();
      emitter.emit('set-readed');
    }
  };

  protected onScrollMessages = () => {
    console.log('xxxxx');
    if (!this.isProgrammScroll) {
      this.onChangeMessages();
    }
  };

  public scrollMessages(isSmooth: boolean) {
    this.isProgrammScroll = true;
    console.log('scrolltrue');
    // this.messages.off('scroll', this.onChangeMessages);
    // console.log('scrolloff');
    // this.isProgrammScroll = true;
    // if (!container || !divider) return;
    const container = this.messages.element;
    const divider = this.divider.element;

    if (this.isDivider) {
      const containerRect = container.getBoundingClientRect();
      const dividerRect = divider.getBoundingClientRect();

      // const remainingHeight = container.scrollHeight - container.clientHeight;
      // if (dividerRect.top >= containerRect.top && remainingHeight > containerRect.height) {
      //   container.scrollTo({
      //     top: container.scrollTop + (dividerRect.top - containerRect.top) - 10,
      //     behavior: 'smooth',
      //   });
      // }

      if (dividerRect.top >= containerRect.top) {
        container.scrollTo({
          top: container.scrollTop + (dividerRect.top - containerRect.top) - 10,
          behavior: isSmooth ? 'smooth' : 'auto',
        });
      }
    } else {
      const isScrollable = container.scrollHeight > container.clientHeight;
      if (isScrollable) {
        container.scrollTo({
          top: container.scrollHeight - container.clientHeight,
          behavior: isSmooth ? 'smooth' : 'auto',
        });
      }
    }
    // if (document.hasFocus()) {
    //   setTimeout(() => {
    //     this.isProgrammScroll = false;
    //     console.log('scrollfalse');
    //   }, 1000);
    //   console.log('focus');
    // } else {
    //   console.log('nofocus');
    // }
  }
}
