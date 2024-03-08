import BaseComponent from '../BaseComponent';
import { ButtonProps } from '../../utils/types';

export default class Button extends BaseComponent<HTMLButtonElement> {
  constructor(props: ButtonProps) {
    super({ tag: 'button', ...props });
    if (props.type) {
      this.attr('type', props.type);
    }
    // if (props.disabled) {
    //   this.disable();
    // }
  }

  // public enable() {
  //   this.element.disabled = false;
  // }

  // public disable() {
  //   console.log('disable');
  //   this.element.disabled = true;
  // }
}
