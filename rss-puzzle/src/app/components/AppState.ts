import level1 from '../puzzle-data/wordCollectionLevel1.json';
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
  //  constructor() {
  //   this.updateState();
  //  }
  public getCurrentText() {
    const levelData = this.levelsData[this.level];
    const round = levelData.rounds[this.round];
    const row = round.words[this.row];
    return row.textExample;
  }
}

const appState = new AppState();

export default appState;
