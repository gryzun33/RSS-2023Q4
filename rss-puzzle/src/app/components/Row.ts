import BaseComponent from './BaseComponent';
import emitter from './EventEmitter';
import appState from './AppState';

export default class Row extends BaseComponent {
  public isActive: boolean = false;
  constructor() {
    super({ tag: 'div', classNames: ['row', 'row-block'] });
    this.on('click', this.onClickHandler);
  }

  public createEmptyCells(numbOfCells: number) {
    for (let i = 0; i < numbOfCells; i += 1) {
      const empty = new BaseComponent({ tag: 'div', classNames: ['empty'] });
      appState.emptiesInResult.push(i);
      this.append(empty);
    }
  }

  public addPiece = (piece?: unknown) => {
    if (!(piece instanceof BaseComponent)) {
      throw new Error();
    }

    if (!piece) {
      throw new Error('piece is undefined');
    }
    appState.emptiesInResult.sort();
    const index = appState.emptiesInResult[0];
    const emptyComp = this.children[+index];
    appState.setIndex(piece.getElement(), index, 'result');
    this.insertBefore(piece, emptyComp, +index);
    emptyComp.destroy();
    appState.emptiesInResult.shift();
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
    const index = appState.getIndex(piece);
    appState.emptiesInResult.push(index);
    const empty = new BaseComponent({ tag: 'div', classNames: ['empty'] });
    const currentPiece = this.children[+index];
    this.insertBefore(empty, this.children[+index], +index);
    emitter.emit('moveToSource', currentPiece);
  };
}
