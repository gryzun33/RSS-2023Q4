import BaseComponent from './BaseComponent';
import Row from './Row';
import { numbRows } from '../utils/constants';
import emitter from './EventEmitter';

export default class ResultField extends BaseComponent {
  public rows: Row[] = [];
  public activeRow?: BaseComponent;
  constructor() {
    super({ tag: 'div', classNames: ['result-field'] });
    this.createView();
    // this.activeRow = this.rows[0];
    [this.activeRow] = this.rows;
    emitter.on('moveToResult', this.addPiece);
    // if (this.activeRow) {
    //   emitter.on('moveToResult', this.addPiece);
    // }
  }

  protected createView() {
    for (let i = 0; i < numbRows; i += 1) {
      const row = new Row();
      this.append(row);
      this.rows.push(row);
    }
  }

  public setActiveRow(i: number) {
    this.activeRow = this.rows[i];
    this.rows[i].addClass('row-active');
  }

  protected addPiece = (piece: BaseComponent) => {
    if (this.activeRow) {
      this.activeRow.append(piece);
    }
  };
}
