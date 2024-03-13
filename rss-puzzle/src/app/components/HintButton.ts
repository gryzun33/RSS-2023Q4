import BaseComponent from './BaseComponent';
import emitter from './EventEmitter';
import appState from './AppState';

export default class HintButton extends BaseComponent {
  constructor(
    protected className: string,
    protected emitterEvent: string,
    protected hintName: string
  ) {
    super({ tag: 'button', classNames: ['hint-btn', className] });
    this.on('click', this.onClickHandler);
  }

  protected onClickHandler = () => {
    this.toggleClass(`hint-active`);
    emitter.emit(this.emitterEvent);
    appState.changeHintState(this.hintName);
  };
}
