import BaseComponent from './BaseComponent';
import Row from './Row';
import { numbRows } from '../utils/constants';
import emitter from './EventEmitter';
// import appState from './AppState';

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
    console.log('destroychilden');
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

  public showFullImage(): void {
    console.log('fullimageshow');
    const textElements = this.findAll('.piece-text');
    textElements.forEach((elem) => {
      elem.classList.add('hide-elem');
    });
    //   const fullImage = new BaseComponent<HTMLImageElement>({ tag: 'img', classNames: ['full-bg'] });
    //   const { src, alt } = appState.getCurrentImageData();
    //   const fullSrc = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${src}`;
    //   fullImage.attr('src', fullSrc);
    //   fullImage.attr('alt', alt);
    //   this.append(fullImage);
  }
}
