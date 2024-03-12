import level1 from '../puzzle-data/wordCollectionLevel1.json';
import BaseComponent from './BaseComponent';
import { numbRows } from '../utils/constants';
import emitter from './EventEmitter';
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
  public levelsData = [level1];
  public level: number = 0;
  public round: number = 0;
  public row: number = 0;
  public numbRows: number = numbRows;

  public text: string;

  public emptiesInSource: number[] = [];
  public emptiesInResult: number[] = [];

  constructor() {
    this.text = '';
  }

  public currPuzzle = new Map();
  //  constructor() {
  //   this.updateState();
  //  }

  public resetState() {
    // this.emptiesInResult = [];
    this.emptiesInSource = [];
    this.currPuzzle.clear();
  }
  public getCurrentData(): { currentText: string; row: number } {
    const { round, row } = this.getCurrentRow();
    console.log('row=', row);
    console.log('round=', round);
    const levelData = this.levelsData[this.level];
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
    this.currPuzzle.set(key, value);
  };

  public getIndex(key: HTMLElement): number {
    const value = this.currPuzzle.get(key);
    const index: number = value.newInd;
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
    const parents: string[] = values.map((value: PieceData) => value.parent);
    if (!parents.every((parent) => parent === 'result')) {
      console.log('not all');
      return;
    }
    values.sort((a, b) => a.newInd - b.newInd);
    const words: string[] = values.map((value) => value.word);
    console.log('words=', words);
    if (words.join(' ') === this.text && !this.isFinishLevel()) {
      console.log('good');
      emitter.emit('iscorrect');
    } else {
      console.log('no good');
    }
  }

  protected isFinishLevel(): boolean {
    const lengthOflevel: number = this.levelsData[this.level].rounds.length;
    if (this.round === lengthOflevel - 1 && this.isLastRow()) {
      return true;
    }
    return false;
  }
}

const appState = new AppState();

export default appState;
