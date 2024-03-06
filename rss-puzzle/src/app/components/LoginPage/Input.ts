import BaseComponent from '../BaseComponent.ts';
import { InputProps } from '../../utils/types.ts';

export default class Input extends BaseComponent<HTMLInputElement> {
  constructor(props: InputProps) {
    super({ tag: 'input', ...props });
    this.attr('type', props.type);
    this.attr('placeholder', props.placeholder);
    if (props.required) {
      this.element.required = true;
    }
  }
}
