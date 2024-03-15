import BaseComponent from './BaseComponent';
import Piece from './Piece';
import { WordData } from '../utils/types';
import emitter from './EventEmitter';
import appState from './AppState';

export default class SourceBlock extends BaseComponent {
  public pieces: BaseComponent[] = [];
  constructor() {
    super({ tag: 'div', classNames: ['source-block'] });
    emitter.on('moveToSource', this.addPiece);
    this.on('click', this.onClickHandler);
  }

  protected onClickHandler = (e: Event) => {
    console.log('emotiesinsource1=', appState.emptiesInSource);
    console.log('target=', e.target);

    if (!(e.target instanceof HTMLElement)) {
      throw new Error();
    }
    const piece = e.target.closest('.piece');
    if (!piece) {
      return;
    }
    if (!(piece instanceof HTMLElement)) {
      throw new Error();
    }
    // if (e.target instanceof HTMLElement && e.target.closest('.piece')) {
    const index = appState.getIndex(piece);
    appState.emptiesInSource.push(index);
    const empty = new BaseComponent({ tag: 'div', classNames: ['empty'] });
    const currentPiece = this.children[+index];
    this.insertBefore(empty, this.children[+index], +index);
    emitter.emit('moveToResult', currentPiece);

    // const index = e.target.getAttribute('data-newnumber');
    // if (index !== null) {
    //   const empty = new BaseComponent({ tag: 'div', classNames: ['empty'] });
    //   empty.attr('data-newnumber', `${index}`);
    //   const currentPiece = this.children[+index];
    //   this.insertBefore(empty, this.children[+index], +index);
    //   emitter.emit('moveToResult', currentPiece);
    // }
    // }
  };

  public createPuzzleRow(text: string) {
    this.destroyChildren();
    const wordsData = this.getWordsData(text);
    // console.log(wordsData);
    wordsData.forEach((wordData: WordData) => {
      const piece = new Piece(wordData, this);
      // const empty = new BaseComponent(wordData, this);
      // console.log('piece', piece.getElement());
      this.append(piece);
      this.pieces.push(piece);
    });
  }

  protected addPiece = (piece?: unknown) => {
    if (!(piece instanceof BaseComponent)) {
      throw new Error();
    }

    if (!piece) {
      throw new Error('piece is undefined');
    }
    console.log('emotiesinsource2=', appState.emptiesInSource);
    appState.emptiesInSource.sort();
    const index = appState.emptiesInSource[0];
    const emptyComp = this.children[+index];
    appState.setIndex(piece.getElement(), index, 'source');
    this.insertBefore(piece, emptyComp, +index);
    emptyComp.destroy();
    appState.emptiesInSource.shift();
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

  protected getWordsData(text: string) {
    const arrWords = text.split(' ');
    const fullLength = arrWords.join('').length;
    const l = arrWords.length;
    const newSet = new Set<number>();
    // let ind = 0;
    while (newSet.size < l) {
      newSet.add(Math.floor(Math.random() * l));
      // newSet.add(ind);
      // ind += 1;
    }
    const newArr: number[] = Array.from(newSet);

    // потом убрать
    // const newArr = arrWords;

    const data: WordData[] = [];
    // const width = `${(100 / l).toFixed(2)}%`;
    let left: number = 0;
    arrWords.forEach((word, i) => {
      const widthInPercent: number = +((word.length * 100) / fullLength).toFixed(2);

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
    // console.log('detailSize=', detailSize);
    const ratio = 100 / detailSize;
    // console.log('ratio=', ratio);
    const size: number = ratio * 100;
    // console.log('size=', size);

    const positionX: number = left * ratio;
    // const positionX = (left * ratio * (size - 100)) / 100;

    // const positionX = (-left * ratio * 100) / (size - 100);

    // const positionX: number = 50 - (left * 100) / detailSize;
    // const positionX: number = -left;

    // console.log('position=', positionX);
    return { size, positionX };
  }

  public showRoundData() {
    this.destroyChildren();
    const { name, author, year } = appState.getRoundData();
    const text = `${name}, ${author}, ${year}`;
    const resultText = new BaseComponent({ tag: 'div', classNames: ['result-text'], text });
    this.append(resultText);
  }

  public clearChildren() {
    this.children = [];
  }
}
