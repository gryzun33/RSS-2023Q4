import BaseComponent from './BaseComponent';
import Row from './Row';
import { numbRows } from '../utils/constants';
import emitter from './EventEmitter';

export default class ResultField extends BaseComponent {
  public rows: Row[] = [];
  public activeRow?: Row;
  constructor() {
    super({ tag: 'div', classNames: ['result-field'] });
    // this.createView();
    // this.activeRow = this.rows[0];
    [this.activeRow] = this.rows;
  }

  protected createView() {
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
    this.rows[ind].isActive = true;
    this.activeRow.createEmptyCells(numbOfCells);
    // need to fix ?????

    emitter.on('moveToResult', this.activeRow.addPiece);

    // emitter.emit('moveToSource', this.activeRow.addPiece);
  }
}
