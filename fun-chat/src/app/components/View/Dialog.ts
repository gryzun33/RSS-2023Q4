import BaseComponent from './BaseComponent';
import { Props } from '../../utils/types';
import emitter from '../EventEmitter';

enum Status {
  online = 'online',
  offline = 'offline',
}

export default class Dialog extends BaseComponent {
  protected dialogUserLogin = new BaseComponent({ tag: 'p', classNames: ['dialog-user-login'] });
  protected dialogUserStatus = new BaseComponent({ tag: 'p', classNames: ['dialog-user-status'] });

  constructor(props: Props) {
    super(props);
    this.createView();
    emitter.on('set-dialog-user', this.setDialogUser);
  }

  protected createView() {
    const dialogUser = new BaseComponent({ tag: 'div', classNames: ['dialog-user'] });
    dialogUser.append(this.dialogUserLogin, this.dialogUserStatus);
    this.append(dialogUser);
  }

  protected setDialogUser = (login: unknown, status: unknown) => {
    console.log('setUSER');
    if (typeof login !== 'string' || typeof status !== 'boolean') {
      throw new Error(`login or status isn't string`);
    }
    this.dialogUserLogin.setTextContent(login);
    this.dialogUserStatus.setTextContent(status ? Status.online : Status.offline);
    if (!status) {
      this.dialogUserStatus.addClass('status-inactive');
    } else {
      this.dialogUserStatus.removeClass('status-inactive');
    }
  };
}
