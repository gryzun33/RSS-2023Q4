import BaseComponent from './BaseComponent';
import Button from './Button';

export default class MainPage extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['main-wrapper'] });
    this.createView();
  }

  protected createView() {
    const button = new Button({ text: 'to Login' });
    this.append(button);
  }
}
