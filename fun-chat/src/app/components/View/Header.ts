import BaseComponent from './BaseComponent';
import { Props } from '../../utils/types';

export default class Header extends BaseComponent {
  protected infoBtn = new BaseComponent({
    tag: 'a',
    classNames: ['main-info-btn'],
  });
  protected logoutBtn = new BaseComponent({
    tag: 'a',
    classNames: ['logout-btn'],
  });
  constructor(props: Props) {
    super(props);
    this.createView();
  }
  protected createView() {
    this.append(this.infoBtn, this.logoutBtn);
  }
}
