import BaseComponent from './BaseComponent';
import Row from './Row';
import { numbRows } from '../utils/constants';
import emitter from './EventEmitter';

export default class ResultField extends BaseComponent {
  public rows: Row[] = [];
  public activeRow?: Row;
  constructor() {
    super({ tag: 'div', classNames: ['result-field'] });
    this.createView();
    // this.activeRow = this.rows[0];
    [this.activeRow] = this.rows;
  }

  protected createView() {
    for (let i = 0; i < numbRows; i += 1) {
      const row = new Row();
      this.append(row);
      this.rows.push(row);
    }
  }

  public setActiveRow(ind: number, numbOfCells: number) {
    this.activeRow = this.rows[ind];
    this.rows[ind].isActive = true;
    this.activeRow.createEmptyCells(numbOfCells);
    emitter.on('moveToResult', this.activeRow.addPiece);
    // emitter.emit('moveToSource', this.activeRow.addPiece);
  }
}
