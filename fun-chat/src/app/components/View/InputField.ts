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

  protected createView(props: InputProps) {
    const label = new BaseComponent({ tag: 'label', classNames: ['label'], text: props.label });
    const inputBox = new BaseComponent({ tag: 'div', classNames: ['input-box'] });
    this.input.attr('minlength', props.minlength);
    this.input.attr('pattern', props.pattern);
    this.input.attr('type', props.type);
    if (props.required) {
      this.input.element.required = true;
    }
    if (props.autocomplete) {
      this.input.attr('autocomplete', 'off');
    }
    this.toolTip.setTextContent(props.toolTip);

    inputBox.append(this.input, this.toolTip);
    this.append(label, inputBox);
  }

  protected onInput = () => {
    if (!this.input.element.validity.valid) {
      this.toolTip.addClass('visible');
      this.input.addClass('incorrect');
    } else {
      this.toolTip.removeClass('visible');
      this.input.removeClass('incorrect');
    }
  };

  // public validInput = (): void => {
  //   this.addClass('input-invalid');
  //   if (this.element.validity.valueMissing) {
  //     this.element.setCustomValidity('Fill this field');
  //   } else if (!this.element.value[0].match(/[A-Z]/)) {
  //     this.element.setCustomValidity('The first letter must be in uppercase');
  //     this.element.reportValidity();
  //   } else if (this.element.validity.patternMismatch) {
  //     this.element.setCustomValidity(`The field can contain English alphabet letters or '-'`);
  //     this.element.reportValidity();
  //   } else if (this.element.validity.tooShort) {
  //     const length = this.attr('minlength');
  //     this.element.setCustomValidity(`Type at least ${length} characters`);
  //     this.element.reportValidity();
  //   } else {
  //     this.element.setCustomValidity('');
  //     this.removeClass('input-invalid');
  //   }
  // };
}
