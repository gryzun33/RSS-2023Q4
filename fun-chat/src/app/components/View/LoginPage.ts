import BaseComponent from './BaseComponent';
import Button from './Button';
import emitter from '../EventEmitter';

export default class LoginPage extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['login-wrapper'] });
    this.createView();
  }

  protected createView() {
    const button = new Button({ text: 'to About' });
    this.append(button);
    // button.on('click', () => emitter.emit('navigate', 'about'));
    button.on('click', () => emitter.emit('login'));
  }
}
