import Button from './Button';
import { ButtonProps } from '../utils/types';
import emitter from './EventEmitter';

export default class ContinueBtn extends Button {
  constructor(props: ButtonProps) {
    super(props);
    // this.on('click', this.disable);
    emitter.on('iscorrect', this.enable);
    emitter.on('setNewRound', this.disable);
  }
}
