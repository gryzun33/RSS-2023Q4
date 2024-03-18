import BaseComponent from './BaseComponent';
import Row from './Row';
import { numbRows } from '../utils/constants';
import emitter from './EventEmitter';
import appState from './AppState';

export default class ResultField extends BaseComponent {
  public rows: Row[] = [];
  public activeRow?: Row;
  constructor() {
    super({ tag: 'div', classNames: ['result-field'] });
    [this.activeRow] = this.rows;
    emitter.on('iscorrect', this.blockRow);
  }

  protected createView() {
    const image = new Image();
    image.src = appState.getCurrentImageData().fullSrc;
    image.onload = () => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const aspectRatio = (width / height).toFixed(2);
      const aspectRatioSource = (+aspectRatio * 10).toString();
      emitter.emit('updateSourceView', aspectRatioSource);
      this.css('aspect-ratio', aspectRatio.toString());
    };

    this.rows = [];
    for (let i = 0; i < numbRows; i += 1) {
      const row = new Row();
      this.append(row);
      this.rows.push(row);
    }
  }

  public updateView(row: number, numbOfCells: number) {
    this.destroyChildren();
    this.createView();
    this.setActiveRow(row, numbOfCells);
  }

  public setActiveRow(ind: number, numbOfCells: number) {
    if (this.activeRow) {
      emitter.off('moveToResult', this.activeRow.addPiece);
    }

    this.activeRow = this.rows[ind];
    this.activeRow.removeClass('row-block');
    this.activeRow.createEmptyCells(numbOfCells);
    emitter.on('moveToResult', this.activeRow.addPiece);
  }

  public showFullImage(): void {
    const textElements = this.findAll('.piece-text');
    textElements.forEach((elem) => {
      elem.classList.add('hide-elem');
    });
  }

  protected blockRow = () => {
    if (!this.activeRow) {
      throw new Error('activerow is undefined');
    }
    this.activeRow.addClass('row-block');
  };
}
