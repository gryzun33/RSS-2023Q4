import BaseComponent from './BaseComponent';
import Button from './Button';
import InputField from './InputField';
import emitter from '../EventEmitter';

export default class LoginPage extends BaseComponent {
  protected inputs: HTMLInputElement[] = [];
  protected loginForm = new BaseComponent<HTMLFormElement>({
    tag: 'form',
    classNames: ['login-form'],
  });

  protected inputLogin = new InputField({
    type: 'text',
    // placeholder: '',
    required: true,
    minlength: '3',
    pattern: '^[a-zA-Z0-9]{3,}$',
    toolTip: `Login must be at least three characters long, and can contain letters and numbers`,
    label: 'Login',
  });

  protected inputPassword = new InputField({
    type: 'password',
    // placeholder: '',
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
    // text: 'Info',
  });

  constructor() {
    super({ tag: 'div', classNames: ['login-wrapper'] });
    this.createView();
    this.loginForm.on('input', this.onChangeForm);
    this.loginForm.on('submit', this.onSubmitForm);
  }

  protected createView() {
    const buttons = new BaseComponent({ tag: 'div', classNames: ['buttons-box'] });
    buttons.append(this.loginBtn, this.infoBtn);
    this.loginForm.append(this.inputLogin, this.inputPassword, buttons);
    this.append(this.loginForm);
    this.loginForm.attr('novalidate', 'true');
    this.loginBtn.disable();
    this.inputs.push(this.inputLogin.input.getElement(), this.inputPassword.input.getElement());
  }

  protected onChangeForm = () => {
    if (this.inputs.every((input) => input.validity.valid && input.value !== '')) {
      this.loginBtn.enable();
    } else {
      this.loginBtn.disable();
    }
  };

  protected onSubmitForm = (event: Event) => {
    const loginValue = this.inputLogin.input.element.value;
    const passValue = this.inputPassword.input.element.value;
    emitter.emit('login', loginValue, passValue);
    event.preventDefault();
  };
}
