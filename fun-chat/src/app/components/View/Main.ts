import BaseComponent from './BaseComponent';
import { Props } from '../../utils/types';

export default class Main extends BaseComponent {
  protected userSearch = new 
  constructor(props: Props) {
    super(props);
    this.createView();
  }
  protected createView() {

    const usersBox = new BaseComponent({ tag: 'div', classNames: ['users-box'] });
    // this.append()
  }
}
