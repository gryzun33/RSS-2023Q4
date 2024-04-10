import BaseComponent from './BaseComponent';
import Button from './Button';
import emitter from '../EventEmitter';

export default class MainPage extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['main-wrapper'] });
    this.createView();
  }

  protected createView() {
    const button = new Button({ text: 'to Login' });
    this.append(button);
    button.on('click', () => emitter.emit('navigate', 'login'));
  }
}
