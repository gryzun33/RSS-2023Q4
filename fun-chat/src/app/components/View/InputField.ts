import BaseComponent from './BaseComponent';
import { InputProps } from '../../utils/types';

export default class InputField extends BaseComponent {
  public input = new BaseComponent<HTMLInputElement>({ tag: 'input', classNames: ['input'] });
  protected toolTip = new BaseComponent({ tag: 'div', classNames: ['tooltip'] });
  constructor(props: InputProps) {
    super({ tag: 'div', classNames: ['input-wrapper'] });
    this.createView(props);
    this.input.on('input', this.onInput);
  }

  protected createView(props: InputProps): void {
    const label = new BaseComponent({ tag: 'label', classNames: ['label'], text: props.label });
    const inputBox = new BaseComponent({ tag: 'div', classNames: ['input-box'] });
    this.input.attr('minlength', props.minlength);
    this.input.attr('pattern', props.pattern);
    this.input.attr('type', props.type);

    this.input.element.required = !!props.required;
    if (props.autocomplete) {
      this.input.attr('autocomplete', 'off');
    }
    this.toolTip.setTextContent(props.toolTip);
    inputBox.append(this.input, this.toolTip);
    this.append(label, inputBox);
  }

  protected onInput = (): void => {
    if (!this.input.element.validity.valid) {
      this.toolTip.addClass('visible');
      this.input.addClass('incorrect');
    } else {
      this.toolTip.removeClass('visible');
      this.input.removeClass('incorrect');
    }
  };
}
