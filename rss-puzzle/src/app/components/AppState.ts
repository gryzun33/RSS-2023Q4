import level1 from '../puzzle-data/wordCollectionLevel1.json';
import BaseComponent from './BaseComponent';
import { numbRows, pathToData } from '../utils/constants';
import emitter from './EventEmitter';
import { HintsState, Statistics, PieceData } from '../utils/types';
import level2 from '../puzzle-data/wordCollectionLevel2.json';
import level3 from '../puzzle-data/wordCollectionLevel3.json';
import level4 from '../puzzle-data/wordCollectionLevel4.json';
import level5 from '../puzzle-data/wordCollectionLevel5.json';
import level6 from '../puzzle-data/wordCollectionLevel6.json';
import { storage } from './Storage';

export type PieceProps = {
  comp: BaseComponent;
  parent: string;
  oldInd: number;
  newInd: number;
  word: string;
};

const roundCompleted = {
  done: 1,
  undone: 0,
};

class AppState {
  protected isStart: boolean = true;
  protected levels = [level1, level2, level3, level4, level5, level6];
  private appLevel: number = 0;
  private appRound: number = 0;
  private appRow: number = 0;
  protected numbRows: number = numbRows;
  protected roundStatistic: boolean[] = [];
  protected text: string;
  protected isAllInResult: boolean = false;
  protected emptiesInSource: number[] = [];
  protected emptiesInResult: number[] = [];

  public hints: HintsState = {
    image: true,
    translation: true,
    sound: true,
  };
  public currPuzzle: Map<HTMLElement, PieceData> = new Map();

  public statistics: Statistics = this.createStatisticsArray();
  constructor() {
    this.text = '';
    this.getDataFromStorage();
  }

  public getLevelsLength(): number {
    return this.levels.length;
  }

  public get level(): number {
    return this.appLevel;
  }

  public set level(value: number) {
    this.appLevel = value;
  }

  public get round(): number {
    return this.appRound;
  }

  public set round(value: number) {
    this.appRound = value;
  }

  public get row(): number {
    return this.appRow;
  }

  public set row(value: number) {
    this.appRow = value;
  }

  public changeHintState(hintName: keyof HintsState) {
    this.hints[hintName] = !this.hints[hintName];
    storage.saveData('hints', this.hints);
  }

  public resetState(): void {
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

  public resetRowState(): void {
    this.emptiesInResult = [];
    this.emptiesInSource = [];
    this.currPuzzle.clear();
    this.isAllInResult = false;
  }
  public getNextData(isSelected: boolean): { currentText: string; row: number } {
    const { level, round, row } = isSelected ? this : this.getNextRow();
    const levelData = this.levels[level];
    const currRound = levelData.rounds[round];
    const currRowData = currRound.words[row];
    this.text = currRowData.textExample;
    return { currentText: this.text, row };
  }

  public getNumbOfRounds(): number {
    const levelData = this.levels[this.level];
    return levelData.rounds.length;
  }

  public addToAppState = ({ comp, parent, oldInd, newInd, word }: PieceProps) => {
    const key = comp.getElement();
    const value: PieceData = {
      parent,
      oldInd,
      newInd,
      word,
    };
    this.currPuzzle.set(key, value);
  };

  public getNewIndex(key: HTMLElement): number {
    const value = this.currPuzzle.get(key);
    if (!value) {
      throw new Error(`value is undefined`);
    }
    return value.newInd;
  }

  public getCorrectIndex(key: HTMLElement): number {
    const value = this.currPuzzle.get(key);
    if (!value) {
      throw new Error(`value is undefined`);
    }
    return value.oldInd;
  }

  public setIndex(key: HTMLElement, ind: number, parent: string): void {
    const value = this.currPuzzle.get(key);
    if (!value) {
      throw new Error(`value is undefined`);
    }
    value.newInd = ind;
    value.parent = parent;
  }

  public isLastRow(): boolean {
    return this.row === this.numbRows - 1;
  }

  protected isLastRound(): boolean {
    return this.round === this.getNumbOfRounds() - 1;
  }

  protected isLastLevel(): boolean {
    return this.level === this.levels.length - 1;
  }

  public resetRoundStatistic(): void {
    this.roundStatistic = [];
  }

  public getFirstEmptyInSource(): number {
    this.emptiesInSource.sort();
    return this.emptiesInSource[0];
  }
  public getFirstEmptyInResult(): number {
    this.emptiesInResult.sort();
    return this.emptiesInResult[0];
  }

  public addEmptyInSource(index: number): void {
    this.emptiesInSource.push(index);
  }

  public addEmptyInResult(index: number): void {
    this.emptiesInResult.push(index);
  }

  public removeFirstEmptyInSource(): void {
    this.emptiesInSource.shift();
  }

  public removeFirstEmptyInResult(): void {
    this.emptiesInResult.shift();
  }

  protected getNextRow(): { level: number; round: number; row: number } {
    if (this.isStart) {
      this.isStart = false;
    } else if (!this.isLastRow()) {
      this.row += 1;
    } else if (!this.isLastRound()) {
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
    const parents: string[] = values.map((value: PieceData) => value.parent);
    if (!parents.every((parent) => parent === 'result')) {
      this.isAllInResult = false;
      return;
    }
    this.isAllInResult = true;
    values.sort((a, b) => a.newInd - b.newInd);

    if (values.every((word) => word.oldInd === word.newInd) && this.isLastRow()) {
      this.setStatisticsData();
      this.addStateToStorage();
    }
    if (values.every((word) => word.oldInd === word.newInd)) {
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

  public getSoundSrc = (rowInd: number): string => {
    const src = this.getRowData(rowInd).audioExample;
    const fullSrc = `${pathToData}${src}`;
    return fullSrc;
  };

  public getRoundData() {
    const { levelData } = this.levels[this.level].rounds[this.round];
    return levelData;
  }

  public getRoundDataForModal() {
    const { author, name, year, cutSrc } = this.getRoundData();
    const fullcutSrc = `${pathToData}images/${cutSrc}`;
    return { author, name, year, fullcutSrc };
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
        audioSrc: `${pathToData}${example.audioExample}`,
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

  public getTranslation(rowInd: number): string {
    return this.getRowData(rowInd).textExampleTranslate;
  }

  public isCorrectPiece(piece: BaseComponent): boolean {
    const key = piece.getElement();
    const value = this.currPuzzle.get(key);
    if (!value) {
      throw new Error(`value is undefined`);
    }
    return value.oldInd === value.newInd;
  }

  public changeAfterHint(): void {
    this.roundStatistic.push(false);
    emitter.emit('iscorrect');
    if (this.isLastRow()) {
      this.setStatisticsData();
      this.addStateToStorage();
    }
  }

  protected createStatisticsArray(): Statistics {
    const levelsArr: number[][] = [];
    for (let i = 0; i < this.levels.length; i += 1) {
      const roundsLength = this.levels[i].rounds.length;
      const roundsArr: number[] = [];
      for (let j = 0; j < roundsLength; j += 1) {
        roundsArr.push(roundCompleted.undone);
      }
      levelsArr.push(roundsArr);
    }
    return levelsArr;
  }

  protected setStatisticsData(): void {
    this.statistics[this.level][this.round] = roundCompleted.done;
    emitter.emit('addDoneRound', this.round);
    if (this.statistics[this.level].every((elem) => elem === roundCompleted.done)) {
      emitter.emit('addDoneLevel', this.level);
    }
  }

  public getDoneLevels(): boolean[] {
    return this.statistics.map((round) => round.every((item) => item === roundCompleted.done));
  }

  public getDoneRounds(ind: number): boolean[] {
    return this.statistics[ind].map((round) => round === roundCompleted.done);
  }

  protected addStateToStorage(): void {
    const state = {
      level: this.level,
      round: this.round,
      statistics: this.statistics,
    };
    storage.saveData('state', state);
  }

  public getRoundStatistic(): boolean[] {
    return this.roundStatistic;
  }

  protected getDataFromStorage(): void {
    const state = storage.getData('state');
    const hints = storage.getData('hints');
    if (state) {
      this.level = state.level;
      this.round = state.round;
      this.row = numbRows - 1;
      this.statistics = state.statistics;
      this.isStart = false;
    }
    if (hints) {
      this.hints = hints;
    }
  }
}

const appState = new AppState();

export default appState;
