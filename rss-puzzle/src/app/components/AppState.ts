import level1 from '../puzzle-data/wordCollectionLevel1.json';
import BaseComponent from './BaseComponent';
import { numbRows } from '../utils/constants';
import emitter from './EventEmitter';
import { HintsState } from '../utils/types';
// import Row from './Row';
// import level2 from '../puzzle-data/wordCollectionLevel2.json';
// import level3 from '../puzzle-data/wordCollectionLevel3.json';
// import level4 from '../puzzle-data/wordCollectionLevel4.json';
// import level5 from '../puzzle-data/wordCollectionLevel5.json';
// import level6 from '../puzzle-data/wordCollectionLevel6.json';
type PieceData = {
  oldInd: number;
  newInd: number;
  parent: string;
  word: string;
};

class AppState {
  public isStart: boolean = true;
  public levels = [level1];
  public level: number = 0;
  public round: number = 0;
  public row: number = 0;
  public numbRows: number = numbRows;

  public roundStatistic: boolean[] = [];

  public text: string;

  public isAllInResult: boolean = false;

  // public allPiecesData: PieceData[] = [];

  public emptiesInSource: number[] = [];
  public emptiesInResult: number[] = [];

  public hints: HintsState = {
    image: false,
  };
  public currPuzzle = new Map();
  constructor() {
    this.text = '';
  }

  public changeHintState(hintName: keyof HintsState) {
    this.hints[hintName] = !this.hints[hintName];
  }

  public resetState() {
    // this.emptiesInResult = [];
    this.emptiesInSource = [];
    this.currPuzzle.clear();
    this.isAllInResult = false;
  }
  public getCurrentData(): { currentText: string; row: number } {
    const { round, row } = this.getCurrentRow();
    console.log('row=', row);
    console.log('round=', round);
    const levelData = this.levels[this.level];
    const currRound = levelData.rounds[round];
    const currRowData = currRound.words[row];
    this.text = currRowData.textExample;
    // return this.text;
    return { currentText: this.text, row };
  }

  // public getNumbOfCells(): number {
  //   return this.getCurrentText().split(' ').length;
  // }

  public addToAppState = (
    comp: BaseComponent,
    parent: string,
    oldInd: number,
    newInd: number,
    word: string
  ) => {
    const key = comp.getElement();
    const value: PieceData = {
      parent,
      oldInd,
      newInd,
      word,
    };
    // this.allPiecesData.push(value);
    this.currPuzzle.set(key, value);
  };

  public getIndex(key: HTMLElement): number {
    const value = this.currPuzzle.get(key);
    const index: number = value.newInd;
    return index;
  }

  public getCorrectIndex(key: HTMLElement): number {
    const value = this.currPuzzle.get(key);
    const index: number = value.oldInd;
    return index;
  }

  public setIndex(key: HTMLElement, ind: number, parent: string): void {
    const value = this.currPuzzle.get(key);
    value.newInd = ind;
    value.parent = parent;
  }

  public isLastRow(): boolean {
    return this.row === this.numbRows - 1;
  }

  public getCurrentRow(): { round: number; row: number } {
    if (this.isStart) {
      this.isStart = false;
    } else if (!this.isLastRow()) {
      this.row += 1;
    } else {
      // emitter.emit('newround');
      this.round += 1;
      this.row = 0;
    }

    return { round: this.round, row: this.row };
  }

  public checkRow(): void {
    const values: PieceData[] = Array.from(this.currPuzzle.values());
    console.log('datafromCheckRow', values);
    const parents: string[] = values.map((value: PieceData) => value.parent);
    if (!parents.every((parent) => parent === 'result')) {
      this.isAllInResult = false;
      console.log('not all');
      return;
    }
    this.isAllInResult = true;
    values.sort((a, b) => a.newInd - b.newInd);
    const words: string[] = values.map((value) => value.word);
    // console.log('words=', words);
    if (words.join(' ') === this.text && !this.isFinishLevel()) {
      console.log('correct');
      this.roundStatistic.push(true);
      emitter.emit('iscorrect');
    } else {
      emitter.emit('isnotcorrect');
      console.log('not correct');
    }
  }

  protected isFinishLevel(): boolean {
    const lengthOflevel: number = this.levels[this.level].rounds.length;
    if (this.round === lengthOflevel - 1 && this.isLastRow()) {
      return true;
    }
    return false;
  }

  public getCurrentImageData(): { src: string; alt: string } {
    const levelData = this.levels[this.level];
    const currRound = levelData.rounds[this.round];
    const src = currRound.levelData.imageSrc;
    const alt = currRound.levelData.name;
    const data = {
      src,
      alt,
    };
    return data;
  }

  public getRoundData() {
    const { levelData } = this.levels[this.level].rounds[this.round];
    return levelData;
  }

  // public getIncorrectIndexes() {
  // const values: PieceData[] = Array.from(this.currPuzzle.values());
  // const wrongIndexes: number[] = [];
  // values.forEach((pieceData: PieceData, i) => {
  //   if (pieceData.newInd !== pieceData.oldInd) {
  //     wrongIndexes.push(i);
  //   }
  // });

  // this.currPuzzle.forEach(([key,value]) => {

  // })
  // return wrongIndexes;
  // }

  isCorrectPiece(piece: BaseComponent) {
    const key = piece.getElement();
    const value = this.currPuzzle.get(key);
    return value.oldInd === value.newInd;
  }

  public changeAfterHint() {
    // const values: PieceData[] = Array.from(this.currPuzzle.values());
    // values.forEach((pieceData: PieceData) => {
    //   pieceData.newInd = pieceData.oldInd;
    // });
    this.roundStatistic.push(false);
    emitter.emit('iscorrect');
    // this.checkRow();
  }
}

const appState = new AppState();

export default appState;
