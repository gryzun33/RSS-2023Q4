import BaseComponent from './BaseComponent';
import { ButtonProps } from '../utils/types';

export default class Button extends BaseComponent<HTMLButtonElement> {
  constructor(props: ButtonProps) {
    super({ tag: 'button', ...props });
    if (props.type) {
      this.attr('type', props.type);
    }
    if (props.callback) {
      this.on('click', props.callback);
    }
    if (props.disabled) {
      this.disable();
    }
  }

  public disable = (): void => {
    console.log('disable');
    // this.element.disabled = true;
    this.removeClass('btn-show');
  };

  public enable = (): void => {
    // this.element.disabled = false;

    this.addClass('btn-show');
  };
}
