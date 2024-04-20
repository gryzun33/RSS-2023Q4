import BaseComponent from './BaseComponent';

export default class Modal extends BaseComponent {
  protected modalContent = new BaseComponent({ tag: 'div', classNames: ['modal-content'] });
  protected modalText = new BaseComponent({ tag: 'p', classNames: ['modal-text'] });

  constructor(text: string) {
    super({ tag: 'div', classNames: ['modal-wrapper'] });
    this.open(text);
  }

  protected createView(): void {
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
  };

  public close = (): void => {
    this.addClass('overlay-hide');
    this.modalContent.addClass('modal-hide');
    this.on('animationend', () => {
      this.destroy();
    });
  };
}
