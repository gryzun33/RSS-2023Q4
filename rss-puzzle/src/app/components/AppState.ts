import level1 from '../puzzle-data/wordCollectionLevel1.json';
import BaseComponent from './BaseComponent';
// import level2 from '../puzzle-data/wordCollectionLevel2.json';
// import level3 from '../puzzle-data/wordCollectionLevel3.json';
// import level4 from '../puzzle-data/wordCollectionLevel4.json';
// import level5 from '../puzzle-data/wordCollectionLevel5.json';
// import level6 from '../puzzle-data/wordCollectionLevel6.json';

class AppState {
  public levelsData = [level1];
  public level: number = 0;
  public round: number = 0;
  public row: number = 0;

  public emptiesInSource: number[] = [];
  public emptiesInResult: number[] = [];

  public currPuzzle = new Map();
  //  constructor() {
  //   this.updateState();
  //  }
  public getCurrentText(): string {
    const levelData = this.levelsData[this.level];
    const round = levelData.rounds[this.round];
    const row = round.words[this.row];
    return row.textExample;
  }

  public getNumbOfCells(): number {
    return this.getCurrentText().split(' ').length;
  }

  public addToAppState = (
    comp: BaseComponent,
    parent: BaseComponent,
    oldInd: number,
    newInd: number
  ) => {
    const key = comp.getElement();
    const value = {
      parent,
      oldInd,
      newInd,
    };
    this.currPuzzle.set(key, value);
  };

  public getIndex(key: HTMLElement): number {
    const value = this.currPuzzle.get(key);
    const index: number = value.newInd;
    return index;
  }

  public setIndex(key: HTMLElement, ind: number): void {
    const value = this.currPuzzle.get(key);
    value.newInd = ind;
  }
}

const appState = new AppState();

export default appState;
