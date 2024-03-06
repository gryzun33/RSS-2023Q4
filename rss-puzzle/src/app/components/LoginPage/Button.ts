import BaseComponent from '../BaseComponent.ts';
import { ButtonProps } from '../../utils/types.ts';

export default class Button extends BaseComponent<HTMLButtonElement> {
  constructor(props: ButtonProps) {
    super({ tag: 'button', ...props });
    if (props.type) {
      this.attr('type', props.type);
    }
    if (props.disabled) {
      this.element.disabled = true;
    }
  }
}
