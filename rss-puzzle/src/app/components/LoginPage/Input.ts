import BaseComponent from '../BaseComponent.ts';
import { InputProps } from '../../utils/types.ts';

export default class Input extends BaseComponent<HTMLInputElement> {
  constructor(props: InputProps) {
    super({ tag: 'input', ...props });
    this.attr('minlength', props.minlength);
    this.attr('pattern', props.pattern);
    this.attr('type', props.type);
    this.attr('placeholder', props.placeholder);
    if (props.required) {
      this.element.required = true;
    }
    this.on('input', this.validInput);
  }

  validInput = () => {
    this.addClass('input-invalid');
    console.log('validation');
    if (this.element.validity.valueMissing) {
      console.log('true');
      this.element.setCustomValidity('Fill this field');
    } else if (!this.element.value[0].match(/[A-Z]/)) {
      this.element.setCustomValidity('The first letter must be in uppercase');
    } else if (this.element.validity.patternMismatch) {
      this.element.setCustomValidity(`The field can contain English alphabet letters or '-'`);
    } else if (this.element.validity.tooShort) {
      this.element.setCustomValidity('Type at least three characters');
    } else {
      this.element.setCustomValidity('');
      this.removeClass('input-invalid');
    }
  };
}
