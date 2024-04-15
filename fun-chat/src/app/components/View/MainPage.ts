import BaseComponent from './BaseComponent';
// import Main from './Main';
import Header from './Header';
import Footer from './Footer';
import Users from './Users';
import Dialog from './Dialog';
import NewMessage from './NewMessage';

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
    const messagesWrapper = new BaseComponent({ tag: 'div', classNames: ['messages-wrapper'] });
    const dialogWrapper = new Dialog({ tag: 'div', classNames: ['dialog-wrapper'] });
    const newMessage = new NewMessage({ tag: 'div', classNames: ['new-message-wrapper'] });
    messagesWrapper.append(dialogWrapper, newMessage);
    main.append(users, messagesWrapper);
    this.append(header, main, footer);
  }
}
