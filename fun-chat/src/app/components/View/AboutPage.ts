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
    this.backBtn.on('click', () => emitter.emit('backNavigate'));
  }

  protected createView() {
    // const button = new Button({ text: 'to Main' });
    this.append(this.backBtn);
  }
}
