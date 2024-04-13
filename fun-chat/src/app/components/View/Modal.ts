import BaseComponent from './BaseComponent';
import Button from './Button';
import emitter from '../EventEmitter';

export default class Modal extends BaseComponent {
  protected okBtn = new Button({
    classNames: ['ok-btn'],
    text: 'Ok',
  });
  protected modalText = new BaseComponent({ tag: 'p', classNames: ['modal-text'] });

  constructor() {
    super({ tag: 'div', classNames: ['modal-wrapper'] });
    this.createView();
    this.okBtn.on('click', this.close);
    emitter.on('openModal', this.open);
    // this.open();
  }

  protected createView(): void {
    this.append(this.modalText, this.okBtn);
  }

  protected setContent(text: string) {
    this.modalText.setTextContent(text);
  }

  protected open = (text: unknown): void => {
    if (typeof text !== 'string') {
      throw new Error('modaltext isn`t string');
    }

    this.addClass('modal-show');
    this.setTextContent(text);
    // this.modalContent.addClass('modal-show');
  };

  protected close = (): void => {
    this.addClass('modal-hide');
    // this.modalContent.addClass('modal-hide');
    this.on('animationend', () => {
      this.removeClass('modal-show');
      this.removeClass('modal-hide');
    });
  };
}
