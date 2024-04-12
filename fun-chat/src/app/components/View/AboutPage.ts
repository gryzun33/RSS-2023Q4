import BaseComponent from './BaseComponent';
// import Button from './Button';
import emitter from '../EventEmitter';

export default class AboutPage extends BaseComponent {
  protected backBtn = new BaseComponent({
    tag: 'a',
    classNames: ['back-btn'],
    text: 'Back',
  });
  constructor() {
    super({ tag: 'div', classNames: ['about-wrapper'] });
    this.createView();
    this.backBtn.on('click', () => emitter.emit('navigate', 'back'));
  }

  protected createView() {
    const title = new BaseComponent({ tag: 'h2', classNames: ['about-title'], text: 'Fun Chat' });
    const text = new BaseComponent({ tag: 'p', classNames: ['about-text'] });
    text.setTextContent(
      'This application was developed as part of the RSSchool course in 2023Q3. The goal of the project was to create a web application for communication and message exchange between users'
    );
    const author = new BaseComponent({
      tag: 'a',
      classNames: ['about-author'],
      text: 'Olga Yakusheva',
    });
    author.attr('href', 'https://gryzun33.github.io/rsschool-cv/');
    author.attr('target', '_blank');
    // const button = new Button({ text: 'to Main' });
    this.append(title, text, author, this.backBtn);
  }

  // The "Fan Chat" application was developed as part of the RSSchool course in 2023Q3. The goal of the project was to create a web application for communication and message exchange between users.
}
