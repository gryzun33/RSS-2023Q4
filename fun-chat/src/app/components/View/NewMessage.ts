import BaseComponent from './BaseComponent';
import Button from './Button';
import { Props } from '../../utils/types';
import emitter from '../EventEmitter';
import { EVENT } from '../../utils/constants';

export default class NewMessage extends BaseComponent {
  protected isEdit: boolean = false;
  protected prevText: string = '';
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

  protected undoEditBtn = new BaseComponent({
    tag: 'div',
    classNames: ['undo-edit-btn', 'hidden'],
  });

  constructor(props: Props) {
    super(props);
    this.createView();
    this.messageInput.on('input', this.onInputMessage);
    this.messageForm.on('submit', this.onSubmitForm);
    this.undoEditBtn.on('click', this.resetForm);

    this.emitterMap = new Map([
      [EVENT.set_dialog_user, this.enableInput],
      [EVENT.change_message, this.changeMessage],
      [EVENT.reset_new_message, this.resetForm],
    ]);
    this.emitterMap.forEach((listener, eventName) => {
      this.unsubscribes.push(emitter.on(eventName, listener));
    });
  }

  protected createView(): void {
    const inputBox = new BaseComponent({ tag: 'div', classNames: ['input-box'] });
    inputBox.append(this.messageInput, this.undoEditBtn);
    this.messageForm.append(inputBox, this.sendBtn);
    this.append(this.messageForm);
    this.messageInput.attr('type', 'text');
    this.messageInput.attr('placeholder', 'Write a message...');
    this.messageInput.getElement().disabled = true;
    this.sendBtn.disable();
  }

  protected enableInput = (): void => {
    this.messageInput.getElement().disabled = false;
  };

  protected onInputMessage = (): void => {
    const { value } = this.messageInput.getElement();
    if (value.trim() === '') {
      this.sendBtn.disable();
    } else {
      this.sendBtn.enable();
    }
  };

  protected onSubmitForm = (e: Event): void => {
    e.preventDefault();
    const message = this.messageInput.getElement().value;
    if (!this.isEdit) {
      emitter.emit('send-message', message);
    } else if (message.trim() !== this.prevText) {
      emitter.emit('edit-message', message);
      this.isEdit = false;
    }

    this.messageInput.getElement().value = '';
    this.sendBtn.disable();
    this.undoEditBtn.addClass('hidden');
  };

  protected changeMessage = (text: unknown): void => {
    if (typeof text !== 'string') {
      throw new Error(`text is not string`);
    }
    this.isEdit = true;
    this.prevText = text;
    this.sendBtn.enable();
    this.undoEditBtn.removeClass('hidden');
    this.messageInput.getElement().value = text;
  };

  protected resetForm = () => {
    this.isEdit = false;
    this.undoEditBtn.addClass('hidden');
    this.messageInput.getElement().value = '';
    this.sendBtn.disable();
  };
}
