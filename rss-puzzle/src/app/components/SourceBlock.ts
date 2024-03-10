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
    console.log('target=', e.target);
    if (e.target instanceof HTMLElement && e.target.closest('.piece')) {
      const index = appState.getIndex(e.target);
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
    }
  };

  public createPuzzleRow(text: string) {
    const wordsData = this.getWordsData(text);
    console.log(wordsData);
    wordsData.forEach((wordData: WordData) => {
      const piece = new Piece(wordData, this);
      // const empty = new BaseComponent(wordData, this);
      console.log('piece', piece.getElement());
      this.append(piece);
      this.pieces.push(piece);
    });
  }

  protected addPiece = (piece: BaseComponent) => {
    appState.emptiesInSource.sort();
    const index = appState.emptiesInSource[0];
    const emptyComp = this.children[+index];
    appState.setIndex(piece.getElement(), index);
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
    while (newSet.size < l) {
      newSet.add(Math.floor(Math.random() * l));
    }
    const newArr: number[] = Array.from(newSet);
    const data: WordData[] = [];
    // const width = `${(100 / l).toFixed(2)}%`;
    arrWords.forEach((word, i) => {
      const width = `${((word.length * 100) / fullLength).toFixed(2)}%`;
      const objWord: WordData = {
        word,
        width,
        oldNumber: i,
        newNumber: newArr[i],
      };
      data.push(objWord);
    });
    data.sort((a, b) => a.newNumber - b.newNumber);
    return data;
  }
}
