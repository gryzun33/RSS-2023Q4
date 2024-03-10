import BaseComponent from './BaseComponent';
import emitter from './EventEmitter';
import appState from './AppState';

export default class Row extends BaseComponent {
  public isActive: boolean = false;
  constructor() {
    super({ tag: 'div', classNames: ['row'] });
    this.on('click', this.onClickHandler);
  }

  public createEmptyCells(numbOfCells: number) {
    // this.activeRow.addClass('row-active');
    for (let i = 0; i < numbOfCells; i += 1) {
      const empty = new BaseComponent({ tag: 'div', classNames: ['empty'] });
      appState.emptiesInResult.push(i);
      // empty.attr('data-newnumber', `${i}`);
      this.append(empty);
    }
  }

  public addPiece = (piece: BaseComponent) => {
    appState.emptiesInResult.sort();
    const index = appState.emptiesInResult[0];
    const emptyComp = this.children[+index];
    appState.setIndex(piece.getElement(), index);
    // piece.attr('data-newnumber', `${index}`);
    this.insertBefore(piece, emptyComp, +index);
    emptyComp.destroy();
    appState.emptiesInResult.shift();
    console.log('appstate=', appState);

    // const emptyElem = this.element.querySelector('.empty');
    // if (!emptyElem) return;
    // const index = emptyElem.getAttribute('data-newnumber');
    // if (index === null) return;
    // const emptyComp = this.children[+index];
    // piece.attr('data-newnumber', `${index}`);
    // this.insertBefore(piece, emptyComp, +index);
    // emptyComp.destroy();
  };

  protected onClickHandler = (e: Event) => {
    console.log('target=', e.target);
    if (e.target instanceof HTMLElement && e.target.closest('.piece')) {
      const index = appState.getIndex(e.target);
      appState.emptiesInResult.push(index);
      const empty = new BaseComponent({ tag: 'div', classNames: ['empty'] });
      const currentPiece = this.children[+index];
      this.insertBefore(empty, this.children[+index], +index);
      emitter.emit('moveToSource', currentPiece);
      // const index = e.target.getAttribute('data-newnumber');
      // if (index !== null) {
      //   const empty = new BaseComponent({ tag: 'div', classNames: ['empty'] });
      //   empty.attr('data-newnumber', `${index}`);
      //   const currentPiece = this.children[+index];
      //   this.insertBefore(empty, this.children[+index], +index);
      //   emitter.emit('moveToSource', currentPiece);
      // }
    }
  };
}
