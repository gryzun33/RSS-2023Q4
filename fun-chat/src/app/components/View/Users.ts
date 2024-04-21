import BaseComponent from './BaseComponent';
import { Props } from '../../utils/types';
import emitter from '../EventEmitter';
import { EVENT } from '../../utils/constants';

export default class Users extends BaseComponent {
  protected usersMap: Map<string, BaseComponent> = new Map();
  public userSearch = new BaseComponent<HTMLInputElement>({
    tag: 'input',
    classNames: ['user-search'],
  });

  public activeList = new BaseComponent<HTMLUListElement>({
    tag: 'ul',
    classNames: ['active-list'],
  });
  public inactiveList = new BaseComponent<HTMLUListElement>({
    tag: 'ul',
    classNames: ['inactive-list'],
  });

  public userList = new BaseComponent<HTMLElement>({ tag: 'div', classNames: ['users-list'] });
  constructor(props: Props) {
    super(props);
    this.createView();
    this.activeList.on('click', this.onClickUsers);
    this.inactiveList.on('click', this.onClickUsers);
    this.userSearch.on('input', this.searchUsers);
    this.usersMap.clear();
    this.emitterMap = new Map([
      [EVENT.external_login, this.addActiveUser],
      [EVENT.external_logout, this.addInactiveUser],
      [EVENT.update_notifications, this.updateNotifications],
    ]);
    this.addUnsubscribers();
  }

  protected createView(): void {
    this.userList.append(this.activeList, this.inactiveList);
    this.append(this.userSearch, this.userList);
    this.userSearch.attr('placeholder', 'Search...');
  }

  protected addActiveUser = (userLogin: unknown, notifications: unknown): void => {
    if (typeof userLogin !== 'string' || typeof notifications !== 'number') {
      throw new Error(`arguments don't match their types`);
    }
    let userItem = this.usersMap.get(userLogin);
    if (!userItem) {
      userItem = this.getNewUserItem(userLogin, notifications);
    }
    userItem.addClass('active-user');
    this.activeList.append(userItem);
  };

  protected addInactiveUser = (userLogin: unknown, notifications: unknown): void => {
    if (typeof userLogin !== 'string' || typeof notifications !== 'number') {
      throw new Error(`arguments don't match their types`);
    }
    let userItem = this.usersMap.get(userLogin);
    if (!userItem) {
      userItem = this.getNewUserItem(userLogin, notifications);
    }
    userItem.removeClass('active-user');
    this.inactiveList.append(userItem);
  };

  protected getNewUserItem(login: string, notifications: number): BaseComponent {
    const userItem = new BaseComponent<HTMLLIElement>({
      tag: 'li',
      classNames: ['user-item'],
    });
    const userLogin = new BaseComponent({
      tag: 'div',
      classNames: ['user-text'],
      text: login,
    });
    const notificationsElem = new BaseComponent({
      tag: 'div',
      classNames: ['user-notifications'],
      text: String(notifications),
    });

    if (notifications === 0) {
      notificationsElem.addClass('hidden');
    }
    userItem.append(userLogin, notificationsElem);
    userItem.attr('data-login', `${login}`);
    this.usersMap.set(login, userItem);
    return userItem;
  }

  protected onClickUsers = (e: Event): void => {
    const { target } = e;
    if (!(target instanceof HTMLElement)) {
      throw new Error(`target isn't HTMLEelement`);
    }
    const userElement = target.closest('.user-item');
    if (!userElement) {
      throw new Error(`userElement is null`);
    }
    const login = userElement.getAttribute('data-login');
    if (userElement.closest('.active-list')) {
      emitter.emit(EVENT.set_dialog_user, login, true);
    } else if (userElement.closest('.inactive-list')) {
      emitter.emit(EVENT.set_dialog_user, login, false);
    }
    emitter.emit(EVENT.reset_new_message);

    this.resetUserList();
  };

  protected searchUsers = (): void => {
    const value = this.userSearch.getElement().value.toLowerCase();
    const users = Array.from(this.usersMap.values());
    if (value.trim() === '') {
      users.forEach((user) => user.removeClass('user-hidden'));
    } else {
      users.forEach((user) => {
        const login = user.attr('data-login');
        if (!login) {
          throw new Error('id is null');
        }
        const loginValue = login.toLowerCase();
        if (!loginValue.includes(value)) {
          user.addClass('user-hidden');
        } else {
          user.removeClass('user-hidden');
        }
      });
    }
  };

  protected resetUserList = (): void => {
    const users = Array.from(this.usersMap.values());
    users.forEach((user) => user.removeClass('user-hidden'));
    this.userSearch.getElement().value = '';
  };

  public updateNotifications = (login: unknown, notifications: unknown): void => {
    if (typeof login !== 'string' || typeof notifications !== 'number') {
      throw new Error(`arguments don't match their types`);
    }
    const userComponent = this.usersMap.get(login);
    if (!userComponent) {
      throw new Error(`user is undefined`);
    }

    const notificationElem = userComponent.children[1];
    notificationElem.setTextContent(String(notifications));
    if (notifications > 0) {
      notificationElem.removeClass('hidden');
    } else {
      notificationElem.addClass('hidden');
    }
  };
}
