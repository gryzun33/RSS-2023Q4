import BaseComponent from './BaseComponent';
import Modal from './Modal';

export default class ModalServer extends Modal {
  constructor(text: string) {
    super(text);
    this.createView();
  }

  protected createView(): void {
    super.createView();
    const loader = new BaseComponent({ tag: 'div', classNames: ['loader'] });
    this.modalContent.append(this.modalText, loader);
  }
}
