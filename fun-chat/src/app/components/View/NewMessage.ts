import BaseComponent from './BaseComponent';
import Button from './Button';
import { Props } from '../../utils/types';
import emitter from '../EventEmitter';

export default class NewMessage extends BaseComponent {
  protected messageForm = new BaseComponent<HTMLFormElement>({
    tag: 'form',
    classNames: ['message-form'],
  });
  protected messageInput = new BaseComponent<HTMLInputElement>({
    tag: 'input',
    classNames: ['message-input'],
  });

  protected sendBtn = new Button({
    type: 'submit',
    classNames: ['send-btn'],
    text: 'Send',
  });

  constructor(props: Props) {
    super(props);
    this.createView();
    emitter.on('set-dialog-user', this.enableInput);
    this.messageInput.on('input', this.onInputMessage);
    this.messageForm.on('submit', this.onSubmitForm);
  }

  protected createView() {
    this.messageForm.append(this.messageInput, this.sendBtn);
    this.append(this.messageForm);

    this.messageInput.attr('type', 'text');
    this.messageInput.attr('placeholder', 'Write a message...');
    this.messageInput.getElement().disabled = true;
    this.sendBtn.disable();
  }

  protected enableInput = () => {
    this.messageInput.getElement().disabled = false;
  };

  protected onInputMessage = () => {
    const { value } = this.messageInput.getElement();
    if (value.trim() === '') {
      this.sendBtn.disable();
    } else {
      this.sendBtn.enable();
    }
  };

  protected onSubmitForm = (e: Event) => {
    e.preventDefault();
    const message = this.messageInput.getElement().value;
    this.messageInput.getElement().value = '';
    this.sendBtn.disable();
    emitter.emit('send-message', message);
  };
}
