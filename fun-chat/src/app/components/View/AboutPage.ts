import BaseComponent from './BaseComponent';
import Button from './Button';
import emitter from '../EventEmitter';

export default class AboutPage extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['about-wrapper'] });
    this.createView();
  }

  protected createView() {
    const button = new Button({ text: 'to Main' });
    this.append(button);
    button.on('click', () => emitter.emit('navigate', 'main'));
  }
}
