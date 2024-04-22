import BaseComponent from './BaseComponent';
import { Props, MessageProps, MessageStatus } from '../../utils/types';
import emitter from '../EventEmitter';
import Message from './Message';
import { isMessageProps } from '../../utils/helpers';
import ContextMenu from './ContextMenu';
import state from '../State';
import { EVENT } from '../../utils/constants';

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

  protected contextMenu?: ContextMenu;

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
    this.messages.on('click', this.onChangeMessages);
    this.messages.on('scroll', this.onScrollMessages);
    this.messages.on('scrollend', this.onScrollEndHandler);

    this.emitterMap = new Map([
      [EVENT.set_dialog_user, this.setDialogUser],
      [EVENT.change_status, this.changeStatus],
      [EVENT.add_message, this.addNewMessage],
      [EVENT.add_messages, this.addMessages],
      [EVENT.delivered, this.setStatusDelivered],
      [EVENT.readed, this.setStatusReaded],
      [EVENT.send_message, this.onChangeMessages],
      [EVENT.edited, this.setStatusEdited],
      [EVENT.deleted, this.deleteMessage],
      [EVENT.delete_divider, this.hideDivider],
    ]);
    this.emitterMap.forEach((listener, eventName) => {
      this.unsubscribes.push(emitter.on(eventName, listener));
    });
  }

  protected createView(): void {
    const dialogUser = new BaseComponent({ tag: 'div', classNames: ['dialog-user'] });
    dialogUser.append(this.dialogUserLogin, this.dialogUserStatus);
    this.messagesBox.append(this.placeholder, this.messages);
    this.append(dialogUser, this.messagesBox);
  }

  protected onScrollEndHandler = (): void => {
    if (this.isProgrammScroll) {
      this.isProgrammScroll = false;
    }
  };

  protected setDialogUser = (login: unknown, status: unknown): void => {
    if (typeof login !== 'string' || typeof status !== 'boolean') {
      throw new Error(`login or status does not match type `);
    }
    this.dialogUserLogin.setTextContent(login);
    this.changeStatus(status);
    this.changePlaceholder();
    this.dialogStatus = DialogStatus.noMessages;
  };

  protected changePlaceholder = (): void => {
    this.placeholder.removeClass('placeholder-hidden');
    this.placeholder.setTextContent(`Please write your first message...`);
  };

  protected changeStatus = (status: unknown): void => {
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

  protected addNewMessage = (msg: unknown): void => {
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
      this.showDivider();
    }

    this.addMessage(msg);
    this.scrollMessages(true);
  };

  protected addMessages = (messages: unknown): void => {
    if (!Array.isArray(messages)) {
      throw new Error(`messages is not array`);
    }

    this.destroyMessages();

    if (messages.length === 0) {
      return;
    }
    this.removePlaceholder();

    messages.forEach((msg: MessageProps) => {
      if (!msg.author && msg.status === MessageStatus.Delivered && !this.isDivider) {
        this.showDivider();
      }
      this.addMessage(msg);
    });
    this.scrollMessages(false);
  };

  protected showDivider = (): void => {
    this.isDivider = true;
    this.messages.append(this.divider);
    this.divider.removeClass('hidden');
  };

  protected removePlaceholder = (): void => {
    this.dialogStatus = DialogStatus.messages;
    this.placeholder.addClass('placeholder-hidden');
  };

  protected addMessage(msg: MessageProps): void {
    const messageComp = new Message(msg);
    this.messages.append(messageComp);
    this.messagesMap.set(msg.id, messageComp);

    if (msg.author) {
      messageComp.on('contextmenu', (e: Event) => {
        e.preventDefault();
        this.createContextMenu(msg.id, messageComp);
      });
    }
  }

  protected setStatusDelivered = (id: unknown): void => {
    if (typeof id !== 'string') {
      throw new Error(`id is not string`);
    }
    const messageComp = this.messagesMap.get(id);
    if (!messageComp) {
      throw new Error(`messageComponent is undefined`);
    }
    messageComp.setStatusDelivered();
  };

  protected setStatusReaded = (id: unknown): void => {
    if (typeof id !== 'string') {
      throw new Error(`id is not string`);
    }
    const messageComp = this.messagesMap.get(id);
    if (!messageComp) {
      throw new Error(`messageComponent is undefined`);
    }
    messageComp.setStatusReaded();
  };

  protected setStatusEdited = (id: unknown, text: unknown): void => {
    if (typeof id !== 'string' || typeof text !== 'string') {
      throw new Error(`arguments are not string`);
    }
    const messageComp = this.messagesMap.get(id);
    if (!messageComp) {
      throw new Error(`messageComponent is undefined`);
    }
    messageComp.setStatusEdited(text);
  };

  protected deleteMessage = (id: unknown): void => {
    if (typeof id !== 'string') {
      throw new Error(`id is not string`);
    }
    const messageComp = this.messagesMap.get(id);
    if (!messageComp) {
      throw new Error(`messageComponent is undefined`);
    }
    this.messagesMap.delete(id);
    if (this.messagesMap.size === 0) {
      this.changePlaceholder();
      this.dialogStatus = DialogStatus.noMessages;
    }
    messageComp.destroy();
  };

  protected destroyMessages = (): void => {
    this.messagesMap.forEach((message) => {
      message.destroy();
    });
    this.messagesMap.clear();
    this.hideDivider();
  };

  protected hideDivider = (): void => {
    this.isDivider = false;
    this.divider.addClass('hidden');
  };

  protected onChangeMessages = (): void => {
    if (this.isDivider) {
      this.hideDivider();
      emitter.emit('set-readed');
    }
  };

  protected onScrollMessages = (): void => {
    if (!this.isProgrammScroll) {
      this.onChangeMessages();
    }
  };

  public scrollMessages(isSmooth: boolean): void {
    this.isProgrammScroll = true;
    const container = this.messages.element;
    const divider = this.divider.element;

    if (this.isDivider) {
      const containerRect = container.getBoundingClientRect();
      const dividerRect = divider.getBoundingClientRect();

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
  }

  protected createContextMenu = (id: string, message: Message): void => {
    if (this.contextMenu) {
      this.contextMenu.destroy();
    }
    const msgData = state.messagesMap.get(id);
    if (!msgData) {
      throw new Error(`msgData is undefined`);
    }
    this.contextMenu = new ContextMenu(id, msgData.text);
    message.append(this.contextMenu);
    if (this.contextMenu) {
      document.addEventListener('click', () => this.contextMenu?.destroy(), { once: true });
    }
  };
}
