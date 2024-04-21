import BaseComponent from './BaseComponent';
import Button from './Button';
import InputField from './InputField';
import ModalLogin from './ModalLogin';
import emitter from '../EventEmitter';
import { EVENT } from '../../utils/constants';

export default class LoginPage extends BaseComponent {
  protected modal?: ModalLogin;
  protected inputs: HTMLInputElement[] = [];
  protected loginForm = new BaseComponent<HTMLFormElement>({
    tag: 'form',
    classNames: ['login-form'],
  });

  protected inputLogin = new InputField({
    type: 'text',
    required: true,
    minlength: '3',
    pattern: '^[a-zA-Zа-яА-Я0-9]{3,}$',
    toolTip: `Login must be at least three characters long, and can contain letters and numbers`,
    label: 'Login',
  });

  protected inputPassword = new InputField({
    type: 'password',
    required: true,
    minlength: '8',
    pattern: '^(?=.*[a-zA-Z])(?=.*\\d).{5,}$',
    toolTip: `Password must be at least 8 characters long, and contain at least one letter and one digit`,
    label: 'Password',
    autocomplete: 'off',
  });

  protected loginBtn = new Button({
    type: 'submit',
    classNames: ['login-btn'],
    text: 'Login',
  });

  protected infoBtn = new BaseComponent({
    tag: 'a',
    classNames: ['info-btn'],
  });

  constructor() {
    super({ tag: 'div', classNames: ['login-wrapper'] });
    this.createView();
    this.loginForm.on('input', this.onChangeForm);
    this.loginForm.on('submit', this.onSubmitForm);
    this.infoBtn.on('click', () => emitter.emit('navigate', 'about'));
    emitter.on(EVENT.incorrect_auth, this.openModal);
  }

  protected createView(): void {
    const buttons = new BaseComponent({ tag: 'div', classNames: ['buttons-box'] });
    buttons.append(this.loginBtn, this.infoBtn);
    this.loginForm.append(this.inputLogin, this.inputPassword, buttons);
    this.append(this.loginForm);
    this.loginForm.attr('novalidate', 'true');
    this.loginBtn.disable();
    this.inputs.push(this.inputLogin.input.getElement(), this.inputPassword.input.getElement());
  }

  protected onChangeForm = (): void => {
    if (this.inputs.every((input) => input.validity.valid && input.value !== '')) {
      this.loginBtn.enable();
    } else {
      this.loginBtn.disable();
    }
  };

  protected onSubmitForm = (event: Event): void => {
    const loginValue = this.inputLogin.input.element.value;
    const passValue = this.inputPassword.input.element.value;
    emitter.emit('login', loginValue, passValue);
    event.preventDefault();
  };

  protected openModal = (text: unknown): void => {
    if (typeof text !== 'string') {
      throw new Error('modaltext isn`t string');
    }
    this.modal = new ModalLogin(text);
    this.append(this.modal);
  };
}
