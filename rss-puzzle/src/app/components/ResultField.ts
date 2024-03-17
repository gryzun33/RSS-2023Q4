import BaseComponent from './BaseComponent';
import Row from './Row';
import { numbRows } from '../utils/constants';
import emitter from './EventEmitter';
import appState from './AppState';
// import emitter from './EventEmitter';
// import appState from './AppState';

export default class ResultField extends BaseComponent {
  public rows: Row[] = [];
  public activeRow?: Row;
  constructor() {
    super({ tag: 'div', classNames: ['result-field'] });
    // this.createView();
    // this.activeRow = this.rows[0];
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

      // const aspectRatioStr = aspectRatio.toString();

      this.css('aspect-ratio', aspectRatio.toString());

      // console.log('Ширина изображения:', width);
      // console.log('Высота изображения:', height);
      // console.log('Соотношение сторон изображения:', aspectRatio);
    };

    this.rows = [];
    for (let i = 0; i < numbRows; i += 1) {
      const row = new Row();
      this.append(row);
      this.rows.push(row);
    }
  }

  public updateView(row: number, numbOfCells: number) {
    console.log('updateviewRRRRRRRRRRR');
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
    // this.rows[ind].isActive = true;
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

  protected blockRow = () => {
    if (!this.activeRow) {
      throw new Error('activerow is undefined');
    }
    this.activeRow.addClass('row-block');
  };
}
