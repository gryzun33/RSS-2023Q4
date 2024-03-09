import BaseComponent from './BaseComponent';
import Input from './Input';
import Button from './Button';
import { storage } from './Storage';
import { СallbackFunc } from '../utils/types';
// import { callbackFunc } from '../../utils/types';

export default class LoginPage extends BaseComponent {
  protected loginForm?: BaseComponent<HTMLFormElement>;
  protected inputName?: Input;
  protected inputSurname?: Input;
  protected loginBtn?: Button;
  protected inputs: HTMLInputElement[] = [];

  // public loadStartPage?: callbackFunc;

  constructor(public loadStartPage: СallbackFunc) {
    console.log('newloginpage');
    super({ tag: 'div', classNames: ['login-page'] });
    // this.loadStartPage = props.callback;
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
      placeholder: '',
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
      placeholder: '',
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
      console.log('submit');
    });
  }

  public checkValidity = () => {
    if (!this.inputName || !this.inputSurname) {
      throw new Error('data in form fields is undefined');
    }
    const invalidInput = [this.inputName, this.inputSurname].find(
      (i) => !i?.getElement().validity.valid
    );
    if (invalidInput) {
      invalidInput.validInput();
    } else {
      storage.saveData('name', this.inputName.getElement().value);
      storage.saveData('surname', this.inputSurname.getElement().value);
      this.loadStartPage();
      // if (!this.inputName || !this.inputSurname) {
      //   throw new Error('data in form fields is undefined');
      // }
    }
  };
}