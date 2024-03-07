import './login-page.scss';

import BaseComponent from '../BaseComponent.ts';
import Input from './Input.ts';
import Button from './Button.ts';

export default class LoginPage extends BaseComponent {
  protected loginForm?: BaseComponent<HTMLFormElement>;
  protected inputName?: Input;
  protected inputSurname?: Input;

  protected loginBtn?: Button;

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
      minlength: '3',
      pattern: '^[A-Z][\\-a-zA-Z]*$',
      onChange: this.checkValidity,
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
      minlength: '3',
      pattern: '^[A-Z][\\-a-zA-Z]*$',
      onChange: this.checkValidity,
    });
    labelSurname.append(this.inputSurname);

    this.loginBtn = new Button({
      type: 'submit',
      classNames: ['login-btn'],
      disabled: true,
      text: 'Login',
    });

    this.loginForm.append(labelName, labelSurname, this.loginBtn);
    loginContent.append(this.loginForm);
    this.append(loginContent);
    this.inputs.push(this.inputName.getElement(), this.inputSurname.getElement());

    this.loginBtn.on('click', this.checkValidity);

    this.loginForm.on('submit', (e: Event) => {
      e.preventDefault();
    });
  }

  public checkValidity = () => {
    const invalidInput = [this.inputName, this.inputSurname].find(
      (i) => !i?.getElement().validity.valid
    );
    if (invalidInput) {
      console.log(invalidInput);
      invalidInput.validInput();
    }
  };
}
