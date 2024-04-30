import BaseComponent from './BaseComponent';
import emitter from '../EventEmitter';
import { AUTHOR_LINK, AUTHOR_NAME } from '../../utils/constants';
import { Navigation } from '../../utils/types';

export default class AboutPage extends BaseComponent {
  protected backBtn = new BaseComponent({
    tag: 'a',
    classNames: ['back-btn'],
    text: 'Back',
  });
  constructor() {
    super({ tag: 'div', classNames: ['about-wrapper'] });
    this.createView();
    this.backBtn.on('click', () => emitter.emit('navigate', Navigation.BACK_FROM_ABOUT));
  }

  protected createView(): void {
    const title = new BaseComponent({ tag: 'h2', classNames: ['about-title'], text: 'Fun Chat' });
    const text = new BaseComponent({ tag: 'p', classNames: ['about-text'] });
    text.setTextContent(
      'This application was developed as part of the RSSchool course in 2023Q3. The goal of the project was to create a web application for communication and message exchange between users'
    );
    const author = new BaseComponent({
      tag: 'a',
      classNames: ['about-author'],
      text: AUTHOR_NAME,
    });
    author.attr('href', AUTHOR_LINK);
    author.attr('target', '_blank');
    this.append(title, text, author, this.backBtn);
  }
}
