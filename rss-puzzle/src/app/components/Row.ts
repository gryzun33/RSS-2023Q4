import BaseComponent from './BaseComponent';
import emitter from './EventEmitter';

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
      empty.attr('data-newnumber', `${i}`);
      this.append(empty);
    }
  }

  public addPiece = (piece: BaseComponent) => {
    // if (!this.activeRow) return;
    const emptyElem = this.element.querySelector('.empty');
    if (!emptyElem) return;
    const index = emptyElem.getAttribute('data-newnumber');
    if (index === null) return;
    const emptyComp = this.children[+index];
    piece.attr('data-newnumber', `${index}`);
    this.insertBefore(piece, emptyComp, +index);
    emptyComp.destroy();
  };

  protected onClickHandler = (e: Event) => {
    console.log('target=', e.target);
    if (e.target instanceof HTMLElement && e.target.closest('.piece')) {
      const index = e.target.getAttribute('data-newnumber');
      if (index !== null) {
        const empty = new BaseComponent({ tag: 'div', classNames: ['empty'] });
        empty.attr('data-newnumber', `${index}`);
        const currentPiece = this.children[+index];
        this.insertBefore(empty, this.children[+index], +index);
        emitter.emit('moveToSource', currentPiece);
      }
    }
  };
}
