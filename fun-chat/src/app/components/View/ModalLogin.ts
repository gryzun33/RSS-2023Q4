import Button from './Button';
import Modal from './Modal';

export default class ModalLogin extends Modal {
  protected okBtn = new Button({
    classNames: ['ok-btn'],
    text: 'Ok',
  });

  constructor(text: string) {
    super(text);
    this.okBtn.on('click', this.close);
    this.createView();
  }

  protected createView(): void {
    super.createView();
    this.modalContent.append(this.modalText, this.okBtn);
  }
}
