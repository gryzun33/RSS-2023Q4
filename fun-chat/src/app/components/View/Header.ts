import BaseComponent from './BaseComponent';
import { Props } from '../../utils/types';
import emitter from '../EventEmitter';
import { infoIconSVG, exitIconSvg } from '../../utils/icons';
import state from '../State';

export default class Header extends BaseComponent {
  protected currUser = new BaseComponent({ tag: 'p', classNames: ['curr-user'] });
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
    this.infoBtn.on('click', () => emitter.emit('navigate', 'about'));
  }
  protected createView() {
    const buttons = new BaseComponent({ tag: 'div', classNames: ['buttons'] });
    this.infoBtn.html(infoIconSVG);
    this.logoutBtn.html(exitIconSvg);
    buttons.append(this.infoBtn, this.logoutBtn);
    const title = new BaseComponent({ tag: 'h1', classNames: ['header-title'], text: 'Fun Chat' });
    this.append(this.currUser, title, buttons);

    const { login } = state.getUser();
    console.log('login=', login);
    this.currUser.html(`<span>${login}</span>`);
  }
}
