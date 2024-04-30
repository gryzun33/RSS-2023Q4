import styles from './form.module.scss';
import { defaultColor } from '../../utils/constants';
import BaseComponent from './BaseComponent';
import Button from './Button';
import { FormState, InputData } from '../../utils/types';

export default class InteractionForm extends BaseComponent<HTMLFormElement> {
  public inputName = new BaseComponent<HTMLInputElement>({
    tag: 'input',
    classNames: [styles.inputName],
  });
  public inputColor = new BaseComponent<HTMLInputElement>({
    tag: 'input',
    classNames: [styles.inputColor],
  });

  public submitBtn = new Button({ classNames: [styles.submitBtn] });

  public disabled: boolean = false;

  public currentId = 0;

  constructor(public formName: string) {
    super({ tag: 'form', classNames: [styles.formBox] });
    this.configureView();
  }

  protected configureView() {
    this.inputName.attr('type', 'text');
    this.inputColor.attr('type', 'color');
    this.append(this.inputName, this.inputColor, this.submitBtn);
    this.children.forEach((component) => {
      component.attr('required', 'true');
    });
  }

  public disable = () => {
    this.disabled = true;
    this.children.forEach((component) => {
      component.attr('disabled', 'true');
    });
  };

  public enable = () => {
    this.disabled = false;
    this.children.forEach((component) => {
      component.removeAttr('disabled');
    });
  };

  protected resetForm() {
    this.inputName.element.value = '';
    this.inputColor.element.value = defaultColor;
  }

  public getInputValue(input: BaseComponent<HTMLInputElement>) {
    return input.getElement().value;
  }

  public getInputsValues(): InputData {
    const name = this.inputName.element.value;
    const color = this.inputColor.element.value;
    const id = this.currentId;
    return { name, color, id };
  }

  public updateView(formState: FormState): void {
    if (formState.disabled) {
      this.disable();
    } else {
      this.enable();
      this.currentId = formState.currentId;
      this.inputName.element.value = formState.nameInput;
      this.inputColor.element.value = formState.colorInput;
    }
  }
}