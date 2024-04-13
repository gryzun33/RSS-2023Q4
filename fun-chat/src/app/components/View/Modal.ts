import BaseComponent from './BaseComponent';
import Button from './Button';

export default class Modal extends BaseComponent {
  protected modalContent = new BaseComponent({ tag: 'div', classNames: ['modal-content'] });
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
    this.modalContent.append(this.modalText, this.okBtn);
    this.append(this.modalContent);
  }

  protected setContent(text: string) {
    const str = text[0].toUpperCase() + text.slice(1);
    this.modalText.setTextContent(str);
  }

  protected open = (text: string): void => {
    this.addClass('overlay-show');
    this.modalContent.addClass('modal-show');
    this.setContent(text);
    // this.modalContent.addClass('modal-show');
  };

  protected close = (): void => {
    this.addClass('overlay-hide');
    this.modalContent.addClass('modal-hide');
    this.on('animationend', () => {
      this.destroy();
      // this.removeClass('modal-show');
      // this.removeClass('modal-hide');
    });

    // function hideModal() {

    // }
  };
}
