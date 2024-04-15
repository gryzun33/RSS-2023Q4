import BaseComponent from './BaseComponent';
import { Props, UserResponse } from '../../utils/types';
import emitter from '../EventEmitter';
// import state from '../State';

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
    emitter.on('addUsersToList', this.createUsersList);
    emitter.on('external-login', this.addActiveUser);
    emitter.on('external-logout', this.addInactiveUser);
    this.userList.on('click', this.onClickUsers);
    this.userSearch.on('input', this.searchUsers);
    // this.inactiveList.on('click', this.onClickInactiveUsers);
  }

  protected createView() {
    this.userList.append(this.activeList, this.inactiveList);
    this.append(this.userSearch, this.userList);
    this.userSearch.attr('placeholder', 'Search...');
  }

  protected createUsersList = (data: unknown) => {
    console.log('list=', data);
    if (!Array.isArray(data)) {
      throw new Error(`data isn't array`);
    }

    data.forEach((user: UserResponse) => {
      const userItem = this.getNewUserItem(user.login);

      if (user.isLogined) {
        userItem.addClass('active-user');
      }
      if (user.isLogined) {
        this.activeList.append(userItem);
      } else {
        this.inactiveList.append(userItem);
      }
    });
  };

  protected addActiveUser = (userLogin: unknown) => {
    if (typeof userLogin !== 'string') {
      throw new Error(`userLogin isn't a string`);
    }
    let userItem = this.usersMap.get(userLogin);
    if (!userItem) {
      userItem = this.getNewUserItem(userLogin);
    }

    userItem.addClass('active-user');
    this.activeList.append(userItem);
  };

  protected addInactiveUser = (userLogin: unknown) => {
    if (typeof userLogin !== 'string') {
      throw new Error(`userLogin isn't a string`);
    }
    const userItem = this.usersMap.get(userLogin);
    if (!userItem) {
      throw new Error(`user is undefined`);
    }
    userItem.removeClass('active-user');
    this.inactiveList.append(userItem);
  };

  protected getNewUserItem(login: string): BaseComponent {
    const userItem = new BaseComponent<HTMLLIElement>({
      tag: 'li',
      classNames: ['user-item'],
    });
    const userLogin = new BaseComponent({
      tag: 'div',
      classNames: ['user-text'],
      text: login,
    });
    userItem.append(userLogin);
    userItem.attr('data-login', `${login}`);
    this.usersMap.set(login, userItem);

    return userItem;
  }

  protected onClickUsers = (e: Event) => {
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
      emitter.emit('set-dialog-user', login, true);
    } else if (userElement.closest('.inactive-list')) {
      emitter.emit('set-dialog-user', login, false);
    }

    this.resetUserList();
  };

  protected searchUsers = () => {
    console.log('input');
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

  protected resetUserList = () => {
    const users = Array.from(this.usersMap.values());
    users.forEach((user) => user.removeClass('user-hidden'));
    this.userSearch.getElement().value = '';
  };
}
