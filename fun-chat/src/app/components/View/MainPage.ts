import BaseComponent from './BaseComponent';
// import Main from './Main';
import Header from './Header';
import Footer from './Footer';
import Users from './Users';

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
    const footer = new Footer({ tag: 'footer', classNames: ['footer'] });

    const main = new BaseComponent({ tag: 'main', classNames: ['main'] });
    const users = new Users({ tag: 'div', classNames: ['users-wrapper'] });
    const dialogWrapper = new BaseComponent({ tag: 'div', classNames: ['dialog-wrapper'] });
    const messagesWrapper = new BaseComponent({ tag: 'div', classNames: ['messages-wrapper'] });
    const newMessage = new BaseComponent({ tag: 'div', classNames: ['new-message-wrapper'] });
    dialogWrapper.append(messagesWrapper, newMessage);
    main.append(users, dialogWrapper);
    this.append(header, main, footer);
  }
}
