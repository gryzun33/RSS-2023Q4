import BaseComponent from './BaseComponent';
import Button from './Button';
import { Props } from '../../utils/types';

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
  }

  protected createView() {
    this.messageForm.append(this.messageInput, this.sendBtn);
    this.append(this.messageForm);

    this.messageInput.attr('type', 'text');
    this.messageInput.attr('placeholder', 'Write a message...');
    this.messageInput.getElement().disabled = true;
    this.sendBtn.disable();
  }
}
