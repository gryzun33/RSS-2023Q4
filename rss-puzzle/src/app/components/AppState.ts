import level1 from '../puzzle-data/wordCollectionLevel1.json';
import BaseComponent from './BaseComponent';
import { numbRows } from '../utils/constants';
import emitter from './EventEmitter';
import { HintsState } from '../utils/types';
import level2 from '../puzzle-data/wordCollectionLevel2.json';
import level3 from '../puzzle-data/wordCollectionLevel3.json';
import level4 from '../puzzle-data/wordCollectionLevel4.json';
import level5 from '../puzzle-data/wordCollectionLevel5.json';
import level6 from '../puzzle-data/wordCollectionLevel6.json';
import { storage } from './Storage';

type PieceData = {
  oldInd: number;
  newInd: number;
  parent: string;
  word: string;
};

type Statistics = number[][];

const roundCompleted = {
  done: 1,
  undone: 0,
};

class AppState {
  public isStart: boolean = true;
  public levels = [level1, level2, level3, level4, level5, level6];
  public level: number = 0;
  public round: number = 0;
  public row: number = 0;
  public numbRows: number = numbRows;
  public roundStatistic: boolean[] = [];
  public text: string;
  public isAllInResult: boolean = false;
  public emptiesInSource: number[] = [];
  public emptiesInResult: number[] = [];

  public hints: HintsState = {
    image: true,
    translation: true,
    sound: true,
  };
  public currPuzzle = new Map();

  public statistics: Statistics = this.createStatisticsArray();
  constructor() {
    this.text = '';
    this.getDataFromStorage();
  }

  public changeHintState(hintName: keyof HintsState) {
    this.hints[hintName] = !this.hints[hintName];
    storage.saveData('hints', this.hints);
  }

  public resetState() {
    this.isStart = true;
    this.level = 0;
    this.round = 0;
    this.row = 0;
    this.roundStatistic = [];
    this.text = '';
    this.statistics = this.createStatisticsArray();
    this.resetRowState();
    this.hints = {
      image: true,
      translation: true,
      sound: true,
    };
  }

  public resetRowState() {
    this.emptiesInResult = [];
    this.emptiesInSource = [];
    this.currPuzzle.clear();
    this.isAllInResult = false;
  }

  // public resetState() {
  //   this.emptiesInResult = [];
  //   this.emptiesInSource = [];
  //   this.currPuzzle.clear();
  //   this.isAllInResult = false;
  // }
  public getNextData(isSelected: boolean): { currentText: string; row: number } {
    const { level, round, row } = isSelected ? this : this.getNextRow();
    console.log('round=', round);
    console.log('row=', row);
    const levelData = this.levels[level];
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

  public getNextRow(): { level: number; round: number; row: number } {
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

    return { level: this.level, round: this.round, row: this.row };
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

    if (values.every((word) => word.oldInd === word.newInd) && this.isLastRow()) {
      this.setStatisticsData();

      this.addStateToStorage();
    }
    if (values.every((word) => word.oldInd === word.newInd)) {
      console.log('correct');

      this.roundStatistic.push(true);
      emitter.emit('iscorrect');
    } else {
      emitter.emit('isnotcorrect');
    }
  }

  public getCurrentImageData(): { src: string; alt: string; fullSrc: string } {
    const levelData = this.levels[this.level];
    const currRound = levelData.rounds[this.round];
    const src = currRound.levelData.imageSrc;
    const alt = currRound.levelData.name;
    const fullSrc = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${src}`;
    const data = {
      src,
      alt,
      fullSrc,
    };
    return data;
  }

  public getSoundSrc = (rowInd: number) => {
    // const examples = this.getRoundExamplesData;

    const src = this.getRowData(rowInd).audioExample;
    const fullSrc = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/${src}`;
    return fullSrc;
  };

  public getRoundData() {
    const { levelData } = this.levels[this.level].rounds[this.round];
    return levelData;
  }

  public getRoundExamplesData() {
    const { words } = this.levels[this.level].rounds[this.round];
    return words;
  }

  public getDataForModal() {
    const data = this.getRoundExamplesData();
    const resultData = data.map((example) => {
      const obj = {
        text: example.textExample,
        audioSrc: `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/${example.audioExample}`,
      };
      return obj;
    });
    return resultData;
  }

  public getRowData(rowInd: number) {
    const roundsData = this.levels[this.level].rounds[this.round].words;
    const rowData = roundsData[rowInd];
    return rowData;
  }

  public getTranslation(rowInd: number) {
    return this.getRowData(rowInd).textExampleTranslate;
  }

  isCorrectPiece(piece: BaseComponent) {
    const key = piece.getElement();
    const value = this.currPuzzle.get(key);
    return value.oldInd === value.newInd;
  }

  public changeAfterHint() {
    this.roundStatistic.push(false);
    emitter.emit('iscorrect');
    if (this.isLastRow()) {
      this.setStatisticsData();
      this.addStateToStorage();
      console.log('statistics=', this.statistics);
    }
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
    console.log('ind????????=', ind);
    // const statisticRound = this.statistics[ind];
    const roundsStatus = this.statistics[ind].map((round) => round === roundCompleted.done);
    console.log('statusrounds=', roundsStatus);
    return roundsStatus;
  }

  protected addStateToStorage(): void {
    const state = {
      level: this.level,
      round: this.round,
      statistics: this.statistics,
    };
    storage.saveData('state', state);
  }

  public getRoundStatistic() {
    return this.roundStatistic;
  }

  protected getDataFromStorage(): void {
    const state = storage.getData('state');
    const hints = storage.getData('hints');

    // console.log('state=', state);
    if (state) {
      this.level = state.level;
      this.round = state.round;
      this.row = numbRows - 1;
      this.statistics = state.statistics;
      this.isStart = false;
    }
    if (hints) {
      this.hints = hints;
      console.log('hints=', hints);
    }
  }
}

const appState = new AppState();

export default appState;
