import BaseComponent from './BaseComponent';
import emitter from './EventEmitter';
import appState from './AppState';

export default class Row extends BaseComponent {
  public isActive: boolean = false;
  constructor() {
    super({ tag: 'div', classNames: ['row', 'row-block'] });
    this.on('click', this.onClickHandler);
  }

  public createEmptyCells(numbOfCells: number): void {
    for (let i = 0; i < numbOfCells; i += 1) {
      const empty = new BaseComponent({ tag: 'div', classNames: ['empty'] });
      appState.addEmptyInResult(i);
      this.append(empty);
    }
  }

  public addPiece = (piece?: unknown): void => {
    if (!(piece instanceof BaseComponent)) {
      throw new Error();
    }

    if (!piece) {
      throw new Error('piece is undefined');
    }
    const index = appState.getFirstEmptyInResult();
    const emptyComp = this.children[+index];
    appState.setIndex(piece.getElement(), index, 'result');
    this.insertBefore(piece, emptyComp, +index);
    emptyComp.destroy();
    appState.removeFirstEmptyInResult();

    appState.checkRow();
  };

  protected onClickHandler = (e: Event) => {
    this.children.forEach((childPiece) => {
      childPiece.removeClass('piece-incorrect');
    });

    if (!(e.target instanceof HTMLElement)) {
      throw new Error('target isn`t HTMLElement');
    }
    const piece = e.target.closest('.piece');
    if (!piece) {
      return;
    }
    if (!(piece instanceof HTMLElement)) {
      throw new Error('piece isn`t HTMLElement');
    }
    const index = appState.getNewIndex(piece);
    appState.addEmptyInResult(index);
    const empty = new BaseComponent({ tag: 'div', classNames: ['empty'] });
    const currentPiece = this.children[+index];
    this.insertBefore(empty, this.children[+index], +index);
    emitter.emit('moveToSource', currentPiece);
  };
}
