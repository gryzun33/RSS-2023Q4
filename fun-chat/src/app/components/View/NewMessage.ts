import BaseComponent from './BaseComponent';
import Button from './Button';
import { Props } from '../../utils/types';

export default class newMessage extends BaseComponent {
  protected messageForm = new BaseComponent<HTMLFormElement>({
    tag: 'form',
    classNames: ['message-form'],
  });
  protected messageInput = new BaseComponent<HTMLInputElement>({
    tag: 'input',
    classNames: ['message-input'],
  });

  protected loginBtn = new Button({
    type: 'submit',
    classNames: ['send-btn'],
    text: 'Send',
  });
  constructor(props: Props) {
    super(props);
    this.createView();
  }

  protected createView() {}
}
