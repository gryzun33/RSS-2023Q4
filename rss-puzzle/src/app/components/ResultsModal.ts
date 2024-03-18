import BaseComponent from './BaseComponent';

export default class ResultsModal extends BaseComponent {
  public modalContent = new BaseComponent({ tag: 'div', classNames: ['modal-content'] });
  constructor() {
    super({ tag: 'div', classNames: ['modal-overlay'] });
    this.createView();
    this.open();
  }

  protected createView() {
    const title = new BaseComponent({ tag: 'h2', classNames: ['modal-title'], text: 'Results' });
    this.modalContent.append(title);
    this.append(this.modalContent);
  }

  protected open() {
    this.addClass('overlay-show');
    this.modalContent.addClass('modal-show');
  }

  protected close() {
    this.removeClass('overlay-show');
    this.modalContent.removeClass('modal-show');
    this.modalContent.on('animationend', () => {
      console.log('thisModal = ', this);
      this.destroy();
    });
  }
}
