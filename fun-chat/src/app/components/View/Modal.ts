import BaseComponent from './BaseComponent';
import Button from './Button';

export default class Modal extends BaseComponent {
  protected okBtn = new Button({
    classNames: ['ok-btn'],
    text: 'Ok',
  });
  protected modalText = new BaseComponent({ tag: 'p', classNames: ['modal-text'] });

  constructor(text: string) {
    super({ tag: 'div', classNames: ['modal-wrapper'] });
    this.createView();
    this.open(text);
    this.okBtn.on('click', this.close);
  }

  protected createView(): void {
    this.append(this.modalText, this.okBtn);
  }

  protected setContent(text: string) {
    this.modalText.setTextContent(text);
  }

  protected open = (text: string): void => {
    this.addClass('modal-show');
    this.setContent(text);
    // this.modalContent.addClass('modal-show');
  };

  protected close = (): void => {
    this.addClass('modal-hide');
    // this.modalContent.addClass('modal-hide');
    this.on('animationend', () => {
      this.destroy();
      // this.removeClass('modal-show');
      // this.removeClass('modal-hide');
    });

    // function hideModal() {

    // }
  };
}
