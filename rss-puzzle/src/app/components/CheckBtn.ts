import Button from './Button';
import { ButtonProps } from '../utils/types';
import emitter from './EventEmitter';

export default class CheckBtn extends Button {
  constructor(props: ButtonProps) {
    super(props);

    emitter.on('isnotcorrect', this.enable);

    emitter.on('moveToSource', this.disable);
    emitter.on('setNewRound', this.disable);
  }
}
