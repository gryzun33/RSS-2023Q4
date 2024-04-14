import BaseComponent from './BaseComponent';
import { Props } from '../../utils/types';

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
  }

  protected createView() {
    this.userList.append(this.activeList, this.inactiveList);
    this.append(this.userSearch, this.userList);
    this.userSearch.attr('placeholder', 'Search...');
  }

  protected createActiveList = (data: []) => {
    data.forEach((user) => {
      const activeUser = new BaseComponent<HTMLLIElement>({
        tag: 'li',
        classNames: ['active-user'],
      });
      activeUser.attr('id', `${user}`);
      this.activeList.append(activeUser);
    });
  };
  protected createInactiveList = (data: []) => {
    data.forEach((user) => {
      const inactiveUser = new BaseComponent<HTMLLIElement>({
        tag: 'li',
        classNames: ['inactive-user'],
      });
      inactiveUser.attr('id', `${user}`);
      this.activeList.append(inactiveUser);
    });
  };
}
