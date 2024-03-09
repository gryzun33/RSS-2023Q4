import BaseComponent from './BaseComponent';
import Piece from './Piece';
import { WordData } from '../utils/types';

export default class SourceBlock extends BaseComponent {
  public pieces: BaseComponent[] = [];
  constructor() {
    super({ tag: 'div', classNames: ['source-block'] });
  }

  public createPuzzleRow(text: string) {
    const wordsData = this.getWordsData(text);
    console.log(wordsData);
    wordsData.forEach((wordData: WordData) => {
      const piece = new Piece(wordData);

      this.append(piece);
      this.pieces.push(piece);
    });
  }

  protected getWordsData(text: string) {
    const arrWords = text.split(' ');
    const l = arrWords.length;
    const newSet = new Set<number>();
    while (newSet.size < l) {
      newSet.add(Math.floor(Math.random() * l));
    }
    const newArr: number[] = Array.from(newSet);
    const data: WordData[] = [];
    const width = `${(100 / l).toFixed(2)}%`;
    arrWords.forEach((word, i) => {
      const objWord: WordData = {
        word,
        width,
        oldNumber: i,
        newNumber: newArr[i],
      };
      data.push(objWord);
    });
    // data.sort((a, b) => a.newNumber - b.newNumber);

    return data;
  }
}
