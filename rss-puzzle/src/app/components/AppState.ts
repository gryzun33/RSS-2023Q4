import level1 from '../puzzle-data/wordCollectionLevel1.json';
import BaseComponent from './BaseComponent';
import { numbRows } from '../utils/constants';
import emitter from './EventEmitter';
import { HintsState } from '../utils/types';
// import Row from './Row';
import level2 from '../puzzle-data/wordCollectionLevel2.json';
import level3 from '../puzzle-data/wordCollectionLevel3.json';
import level4 from '../puzzle-data/wordCollectionLevel4.json';
import level5 from '../puzzle-data/wordCollectionLevel5.json';
import level6 from '../puzzle-data/wordCollectionLevel6.json';

type PieceData = {
  oldInd: number;
  newInd: number;
  parent: string;
  word: string;
};

type Statistics = number[][];

// type LevelFullData = {
//   rounds: RoundData[];
//   roundsCount: number;
// };

// type RoundData = {
//   levelData: LevelData;
//   words: ExampleData[];
// };

// type LevelData = {
//   id: string;
//   name: string;
//   imageSrc: string;
//   curSrc: string;
//   author: string;
//   year: string;
// };

// type ExampleData = {
//   audioExample: string;
//   textExample: string;
//   textExampleTranslate: string;
//   id: number;
//   word: string;
//   wordTranslate: string;
// };

const roundCompleted = {
  done: 1,
  undone: 0,
};

class AppState {
  // const statistics = [
  //   {

  //   }
  // ]

  public isStart: boolean = true;
  public levels = [level1, level2, level3, level4, level5, level6];
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

  public statistics: Statistics = this.createStatisticsArray();
  constructor() {
    this.text = '';
  }

  public changeHintState(hintName: keyof HintsState) {
    this.hints[hintName] = !this.hints[hintName];
  }

  public resetState() {
    this.emptiesInResult = [];
    this.emptiesInSource = [];
    this.currPuzzle.clear();
    this.isAllInResult = false;
  }
  public getNextData(isSelected: boolean): { currentText: string; row: number } {
    const { round, row } = isSelected ? this : this.getNextRow();
    console.log('round=', round);
    console.log('row=', row);
    const levelData = this.levels[this.level];
    const currRound = levelData.rounds[round];
    const currRowData = currRound.words[row];
    this.text = currRowData.textExample;
    // return this.text;
    return { currentText: this.text, row };
  }

  // public getSelectedData() {}

  public getNumbOfRounds(): number {
    const levelData = this.levels[this.level];
    const roundsLength = levelData.rounds.length;
    console.log('roundslength=', roundsLength);
    return roundsLength;
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

  public isLastRound(): boolean {
    return this.round === this.getNumbOfRounds() - 1;
  }

  public isLastLevel(): boolean {
    return this.level === this.levels.length - 1;
  }

  public getNextRow(): { round: number; row: number } {
    if (this.isStart) {
      this.isStart = false;
    } else if (!this.isLastRow()) {
      this.row += 1;
    } else if (!this.isLastRound()) {
      // emitter.emit('newround');
      this.round += 1;
      this.row = 0;
    } else if (!this.isLastLevel()) {
      this.level += 1;
      this.round = 0;
      this.row = 0;
    } else {
      this.level = 0;
      this.round = 0;
      this.row = 0;
    }

    return { round: this.round, row: this.row };
  }

  public checkRow(): void {
    const values: PieceData[] = Array.from(this.currPuzzle.values());
    // console.log('datafromCheckRow', values);
    const parents: string[] = values.map((value: PieceData) => value.parent);
    if (!parents.every((parent) => parent === 'result')) {
      this.isAllInResult = false;
      // console.log('not all');
      return;
    }
    this.isAllInResult = true;
    values.sort((a, b) => a.newInd - b.newInd);
    // const words: string[] = values.map((value) => value.word);

    if (values.every((word) => word.oldInd === word.newInd) && this.isLastRow()) {
      this.setStatisticsData();
    }
    // if (words.join(' ') === this.text && this.isLastRow()) {
    //   this.setStatisticsData();
    // }

    if (values.every((word) => word.oldInd === word.newInd)) {
      console.log('correct');

      this.roundStatistic.push(true);
      emitter.emit('iscorrect');
    } else {
      emitter.emit('isnotcorrect');
    }
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
    if (this.isLastRow()) {
      this.setStatisticsData();
      console.log('statistics=', this.statistics);
    }
    // this.checkRow();
  }

  createStatisticsArray(): Statistics {
    const levelsArr: number[][] = [];
    // console.log('levels=', this.levels);
    for (let i = 0; i < this.levels.length; i += 1) {
      const roundsLength = this.levels[i].rounds.length;
      const roundsArr: number[] = [];
      for (let j = 0; j < roundsLength; j += 1) {
        roundsArr.push(roundCompleted.undone);
      }
      levelsArr.push(roundsArr);
    }
    console.log('statistics=', levelsArr);
    return levelsArr;
  }

  setStatisticsData() {
    this.statistics[this.level][this.round] = roundCompleted.done;
    emitter.emit('addDoneRound', this.round);
    if (this.statistics[this.level].every((elem) => elem === roundCompleted.done)) {
      emitter.emit('addDoneLevel', this.level);
    }
  }

  public getDoneLevels() {
    const levelsStatus = this.statistics.map((round) =>
      round.every((item) => item === roundCompleted.done)
    );
    console.log('statuslevels=', levelsStatus);
    return levelsStatus;
  }

  public getDoneRounds(ind: number) {
    // const statisticRound = this.statistics[ind];
    const roundsStatus = this.statistics[ind].map((round) => round === roundCompleted.done);
    console.log('statusrounds=', roundsStatus);
    return roundsStatus;
  }
}

const appState = new AppState();

export default appState;
