import BaseComponent from './BaseComponent';
import Button from './Button';

export default class InteractionForm extends BaseComponent<HTMLFormElement> {
  public inputName = new BaseComponent<HTMLInputElement>({
    tag: 'input',
    classNames: ['input-name'],
  });
  public inputColor = new BaseComponent<HTMLInputElement>({
    tag: 'input',
    classNames: ['input-color'],
  });

  public submitBtn = new Button({ classNames: ['submit-btn'] });

  constructor() {
    super({ tag: 'form', classNames: ['form-box'] });
    this.configureView();
  }

  protected configureView() {
    this.inputName.getElement().type = 'text';
    this.inputColor.getElement().type = 'color';
    this.append(this.inputName, this.inputColor, this.submitBtn);
  }

  public disable() {
    this.element.disabled = true;
  }

  public enable() {
    this.element.disabled = false;
  }
}
