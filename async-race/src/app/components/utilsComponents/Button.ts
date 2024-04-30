import BaseComponent from './BaseComponent';
import { ButtonProps } from '../../utils/types';

export default class Button extends BaseComponent<HTMLButtonElement> {
  public enableState: boolean = true;
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
    this.element.disabled = true;
  };

  public enable = (): void => {
    this.element.disabled = false;
  };
}
