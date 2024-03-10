import BaseComponent from './BaseComponent';
import { WordData } from '../utils/types';
import appState from './AppState';

export default class Piece extends BaseComponent {
  protected isInResult: boolean = false;
  constructor(
    props: WordData,
    public parent: BaseComponent
  ) {
    super({ tag: 'div', classNames: ['piece'], text: props.word });

    // this.attr('data-number', `${props.oldNumber}`);
    // this.attr('data-newnumber', `${props.newNumber}`);

    this.css('width', `${props.width}`);
    appState.addToAppState(this, parent, props.oldNumber, props.newNumber);
  }
}
