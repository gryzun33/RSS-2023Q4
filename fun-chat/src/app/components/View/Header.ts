import BaseComponent from './BaseComponent';
import { Props } from '../../utils/types';
import emitter from '../EventEmitter';

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
    this.logoutBtn.on('click', () => emitter.emit('logout'));
  }
  protected createView() {
    this.append(this.infoBtn, this.logoutBtn);
  }
}
