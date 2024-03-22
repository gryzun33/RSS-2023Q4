import BaseComponent from './BaseComponent';
import Piece from './Piece';
import { WordData } from '../utils/types';
import emitter from './EventEmitter';
import appState from './AppState';
import { padding } from '../utils/constants';

export default class SourceBlock extends BaseComponent {
  public pieces: BaseComponent[] = [];
  constructor() {
    super({ tag: 'div', classNames: ['source-block'] });
    emitter.on('moveToSource', this.addPiece);
    emitter.on('updateSourceView', this.updateView);
    this.on('click', this.onClickHandler);
  }

  protected onClickHandler = (e: Event) => {
    if (!(e.target instanceof HTMLElement)) {
      throw new Error(`target isn't HTMLElement`);
    }
    const piece = e.target.closest('.piece');
    if (!piece) {
      return;
    }
    if (!(piece instanceof HTMLElement)) {
      throw new Error(`piece isn't HTMLElement`);
    }
    const index = appState.getIndex(piece);
    appState.addEmptyInSource(index);
    const empty = new BaseComponent({ tag: 'div', classNames: ['empty'] });
    const currentPiece = this.children[+index];
    this.insertBefore(empty, this.children[+index], +index);
    emitter.emit('moveToResult', currentPiece);
  };

  public createPuzzleRow(text: string): void {
    this.destroyChildren();
    const wordsData = this.getWordsData(text);
    wordsData.forEach((wordData: WordData) => {
      const piece = new Piece(wordData, this);
      this.append(piece);
      this.pieces.push(piece);
    });
  }

  protected addPiece = (piece?: unknown): void => {
    if (!piece) {
      throw new Error('piece is undefined');
    }
    if (!(piece instanceof BaseComponent)) {
      throw new Error('piece isn`t instance of BaseComponent');
    }
    const index = appState.getFirstEmptyInSource();
    const emptyComp = this.children[+index];
    appState.setIndex(piece.getElement(), index, 'source');
    this.insertBefore(piece, emptyComp, +index);
    emptyComp.destroy();
    appState.removeFirstEmptyInSource();
  };

  protected getWordsData(text: string): WordData[] {
    const arrWords = text.split(' ');
    const paddings = arrWords.length * padding;
    const lengthWithoutPaddings = 100 - paddings;
    const fullLength = arrWords.join('').length;
    const l = arrWords.length;
    const newSet = new Set<number>();
    while (newSet.size < l) {
      newSet.add(Math.floor(Math.random() * l));
    }
    const newArr: number[] = Array.from(newSet);

    const data: WordData[] = [];
    let left: number = 0;
    arrWords.forEach((word, i) => {
      const widthInPercent: number = +(
        (word.length * lengthWithoutPaddings) / fullLength +
        padding
      ).toFixed(2);

      const bg = this.getBgStyles(left, widthInPercent);

      const width = `${widthInPercent}%`;
      const objWord: WordData = {
        word,
        width,
        oldNumber: i,
        newNumber: newArr[i],
        bgSize: bg.size,
        bgPositionX: bg.positionX,
      };
      data.push(objWord);
      left += widthInPercent;
    });
    data.sort((a, b) => a.newNumber - b.newNumber);
    return data;
  }

  protected getBgStyles(left: number, detailSize: number): { size: number; positionX: number } {
    const ratio = 100 / detailSize;
    const size: number = ratio * 100;
    const positionX: number = left * ratio;
    return { size, positionX };
  }

  public showRoundData(): void {
    this.destroyChildren();
    const { name, author, year } = appState.getRoundData();
    const text = `${author} - ${name}, ${year}`;
    const resultText = new BaseComponent({ tag: 'div', classNames: ['result-text'], text });
    this.append(resultText);
  }

  public clearChildren(): void {
    this.children = [];
  }

  protected updateView = (aspectRatio: unknown): void => {
    if (typeof aspectRatio !== 'string') {
      throw new Error('aspectRatio is not string');
    }

    this.css('aspect-ratio', aspectRatio);
  };
}
