import BaseComponent from './BaseComponent';
import { Props, UserResponse } from '../../utils/types';
import emitter from '../EventEmitter';
// import state from '../State';

export default class Users extends BaseComponent {
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
      // const className = user.isLogined ? 'active-user' : 'inactive-user';
      const userItem = new BaseComponent<HTMLLIElement>({
        tag: 'li',
        classNames: ['user-item'],
      });
      if (user.isLogined) {
        userItem.addClass('active-user');
      }
      const userLogin = new BaseComponent({
        tag: 'div',
        classNames: ['user-text'],
        text: user.login,
      });
      userItem.append(userLogin);
      userItem.attr('id', `${user.login}`);

      if (user.isLogined) {
        this.activeList.append(userItem);
      } else {
        this.inactiveList.append(userItem);
      }
    });
  };
  // protected createInactiveList = (data: UserResponse[]) => {
  //   data.forEach((user) => {
  //     const inactiveUser = new BaseComponent<HTMLLIElement>({
  //       tag: 'li',
  //       classNames: ['inactive-user'],
  //     });
  //     inactiveUser.attr('id', `${user}`);
  //     this.activeList.append(inactiveUser);
  //   });
  // };
}
