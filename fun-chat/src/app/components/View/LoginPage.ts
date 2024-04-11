import BaseComponent from './BaseComponent';
import Button from './Button';
import InputField from './InputField';
// import emitter from '../EventEmitter';

export default class LoginPage extends BaseComponent {
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
    type: 'text',
    // placeholder: '',
    required: true,
    minlength: '8',
    pattern: '^(?=.*[a-zA-Z])(?=.*d).{5,}$',
    toolTip: `Password must be at least 8 characters long, and contain at least one letter and one digit`,
    label: 'Password',
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
  }

  // protected createView() {
  //   const button = new Button({ text: 'to About' });
  //   this.append(button);
  //   // button.on('click', () => emitter.emit('navigate', 'about'));
  //   button.on('click', () => emitter.emit('login'));
  // }

  protected createView() {
    // const loginContent = new BaseComponent({ tag: 'div', classNames: ['login-content'] });
    const buttons = new BaseComponent({ tag: 'div', classNames: ['buttons-box'] });
    buttons.append(this.loginBtn, this.infoBtn);

    this.loginForm.append(this.inputLogin, this.inputPassword, buttons);
    // loginContent.append(this.loginForm);

    this.append(this.loginForm);

    this.loginForm.attr('novalidate', 'true');
    this.loginBtn.disable();
    // this.inputs.push(this.inputName.getElement(), this.inputSurname.getElement());
    // this.loginBtn.on('click', this.checkValidity);
  }
}
