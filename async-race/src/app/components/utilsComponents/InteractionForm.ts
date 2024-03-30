import styles from './form.module.scss';
import { defaultColor } from '../../utils/constants';
import BaseComponent from './BaseComponent';
import Button from './Button';

export default class InteractionForm extends BaseComponent<HTMLFormElement> {
  public inputName = new BaseComponent<HTMLInputElement>({
    tag: 'input',
    classNames: [styles.inputName],
  });
  public inputColor = new BaseComponent<HTMLInputElement>({
    tag: 'input',
    classNames: [styles.inputColor],
  });

  // public inputNameValue = this.getInputValue(this.inputName);
  // public inputColorValue = this.getInputValue(this.inputColor);

  public submitBtn = new Button({ classNames: [styles.submitBtn] });

  constructor() {
    super({ tag: 'form', classNames: [styles.formBox] });
    this.configureView();
  }

  protected configureView() {
    // this.inputName.getElement().type = 'text';
    // this.inputColor.getElement().type = 'color';
    this.inputName.attr('type', 'text');
    this.inputColor.attr('type', 'color');
    this.append(this.inputName, this.inputColor, this.submitBtn);
    this.children.forEach((component) => {
      component.attr('required', 'true');
    });
  }

  public disable = () => {
    this.children.forEach((component) => {
      component.attr('disabled', 'true');
    });
  };

  public enable = () => {
    this.children.forEach((component) => {
      component.removeAttr('disabled');
    });
  };

  protected resetForm() {
    this.inputName.element.value = '';
    this.inputColor.element.value = defaultColor;
  }

  // protected getNameValue() {
  //   this.inputName.getElement().value;
  // }

  // protected getColorValue() {
  //   this.inputColor.getElement().value;
  // }

  protected getInputValue(input: BaseComponent<HTMLInputElement>) {
    return input.getElement().value;
  }
}
