import BaseComponent from './BaseComponent';
import Main from './Main';
import Header from './Header';
import Footer from './Footer';

// import Button from './Button';
// import emitter from '../EventEmitter';

export default class MainPage extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['main-wrapper'] });
    this.createView();
  }

  protected createView() {
    // const button = new Button({ text: 'to Login' });
    // this.append(button);
    // button.on('click', () => emitter.emit('navigate', 'login'));

    const header = new Header({ tag: 'header', classNames: ['header'] });
    const main = new Main({ tag: 'main', classNames: ['main'] });
    const footer = new Footer({ tag: 'footer', classNames: ['footer'] });
    this.append(header, main, footer);
  }
}
