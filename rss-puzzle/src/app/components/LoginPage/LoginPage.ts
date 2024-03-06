import './login-page.scss';

import BaseComponent from '../BaseComponent.ts';
import Input from './Input.ts';
import Button from './Button.ts';

export default class LoginPage extends BaseComponent {
  protected loginForm?: BaseComponent<HTMLFormElement>;
  protected inputName?: BaseComponent<HTMLInputElement>;
  protected inputSurname?: BaseComponent<HTMLInputElement>;
  protected inputs: HTMLInputElement[] = [];

  constructor() {
    super({ tag: 'div', classNames: ['login-page'] });
    this.createView();
  }

  protected createView() {
    const loginContent = new BaseComponent({ tag: 'div', classNames: ['login-content'] });

    this.loginForm = new BaseComponent<HTMLFormElement>({
      tag: 'form',
      classNames: ['login-form'],
    });

    const labelName = new BaseComponent({
      classNames: ['login-label'],
      text: 'First name',
    });
    this.inputName = new Input({
      type: 'text',
      placeholder: 'Enter name...',
      classNames: ['login-input', 'input-name'],
      required: true,
    });
    labelName.append(this.inputName);

    const labelSurname = new BaseComponent({
      classNames: ['login-label'],
      text: 'Surname',
    });
    this.inputSurname = new Input({
      type: 'text',
      placeholder: 'Enter surname...',
      classNames: ['login-input', 'input-surname'],
      required: true,
    });
    labelSurname.append(this.inputSurname);

    const loginBtn = new Button({
      type: 'submit',
      classNames: ['login-btn'],
      disabled: false,
      text: 'Login',
    });

    this.loginForm.append(labelName, labelSurname, loginBtn);
    loginContent.append(this.loginForm);
    this.append(loginContent);
    this.inputs.push(this.inputName.getElement(), this.inputSurname.getElement());
  }
}
