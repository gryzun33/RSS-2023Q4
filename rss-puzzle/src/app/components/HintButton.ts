import BaseComponent from './BaseComponent';
import emitter from './EventEmitter';

export default class HintButton extends BaseComponent {
  constructor(
    protected className: string,
    protected emitterEvent: string
  ) {
    super({ tag: 'button', classNames: ['hint-btn', className] });
    this.on('click', this.onClickHandler);
  }

  protected onClickHandler = () => {
    this.toggleClass(`hint-active`);
    emitter.emit(this.emitterEvent);
  };
}
