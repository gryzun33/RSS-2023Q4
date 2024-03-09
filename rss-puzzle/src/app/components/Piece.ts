import BaseComponent from './BaseComponent';
// import { Props } from "../utils/types";
import emitter from './EventEmitter';
import { WordData } from '../utils/types';

export default class Piece extends BaseComponent {
  protected isInResult: boolean = false;
  constructor(props: WordData) {
    super({ tag: 'div', classNames: ['piece'], text: props.word });

    this.attr('data-number', `${props.oldNumber}`);
    this.css('order', `${props.newNumber}`);
    this.css('width', `${props.width}`);
    this.on('click', this.onClickHandler);
  }

  protected onClickHandler = () => {
    console.log('clickonpiece');
    if (!this.isInResult) {
      emitter.emit('moveToResult', this);
    } else {
      emitter.emit('moveToSource', this);
    }
    this.isInResult = !this.isInResult;
  };
}
