import createHTMLElement from '../utils/createHTMLElement';
import Field from './Field';
import Controls from './Controls';
import Timer from './Timer';
import DataBank from './DataBank';
import nonograms from '../data/nonograms';

export default class Main {
  constructor(parent) {
    this.isGame = false;
    this.mainElem = null;
    this.currentGame = null;
    this.nonograms = nonograms;
    this.currentGame = this.nonograms[0].games[0];
    this.userGame = null;
    this.createView(parent);

    this.gamesMap = this.createMapOfGames(this.nonograms);
    // console.log('gamesMap=', this.gamesMap);

    this.dataBank = new DataBank();
  }

  createView(parent) {
    this.mainElem = createHTMLElement('div', 'wrapper', parent);

    this.header = createHTMLElement('header', 'header', this.mainElem);
    this.title = createHTMLElement('h1', 'title', this.header, 'NONOGRAMS');

    this.gameWrapper = createHTMLElement('main', 'game-wrapper', this.mainElem);
    this.fieldWrapper = createHTMLElement('div', 'field-wrapper', this.gameWrapper);

    this.timer = new Timer(this.gameWrapper);
    this.controls = new Controls(
      this.gameWrapper,
      this.initRandomGame,
      this.initChosenGame,
      this.initNewGame,
      this.saveCurrentGame
    );
    this.initNewGame();
  }

  getHTMLElement() {
    return this.mainElem;
  }

  startGame = () => {
    this.isGame = true;
    this.timer.runTimer();
    console.log('start game');
  };

  checkGame = () => {
    this.userGame = this.field.getUserGame();
    const gameStr = this.currentGame.gameMatrix.flat().join('');
    console.log('gameStr', gameStr);
    const userGameStr = this.userGame.flat().join('');
    console.log('userGameStr', userGameStr);
    if (gameStr === userGameStr) {
      console.log('WIIINNN!!!!!!');
      this.finishGame();
      this.timer.stopTimer();
    } else {
      console.log('FAAAAIL!!!!!');
    }
  };

  initRandomGame = () => {
    this.currentGame = this.getRandomGame();
    // console.log('currentgame=', this.currentGame);
    const gameId = this.currentGame.gameId;
    const level = this.currentGame.level;
    // const level = `${this.currentGame.gameMatrix.length} x ${this.currentGame.gameMatrix.length}`;
    this.controls.updateSelects(level, gameId);
    this.initNewGame();
  };

  initChosenGame = () => {
    this.currentGame = this.gamesMap.get(+this.controls.selectGame.elem.value);
    this.currentGame.gameId = this.controls.selectGame.elem.value;
    // console.log('currentgame=', this.currentGame);
    this.initNewGame();
  };

  initNewGame = () => {
    // console.log('gamefromInitgame=', this.currentGame);
    this.timer.resetTimer();
    this.fieldWrapper.innerHTML = '';
    this.field = new Field(
      this.fieldWrapper,
      this.currentGame,
      this.checkGame,
      this.startGame,
      this.isGame
    );

    // this.field.setCallbackToField(this.clickOnFieldLeft);
    // this.userGame = this.field.getUserGame();
  };

  getRandomGame() {
    const games = this.nonograms.map((level) => level.games).flat();
    let randNumber;
    if (this.currentGame !== null) {
      do {
        randNumber = Math.floor(Math.random() * games.length);
      } while (games[randNumber].gameId === this.currentGame.gameId);
      return games[randNumber];
    }
    randNumber = Math.floor(Math.random() * games.length);
    return games[randNumber];
  }

  finishGame() {
    this.isGame = false;
    this.timer.stopTimer();
    this.dataBank.saveFinishedGame(this.currentGame, this.timer.timeData);
  }

  saveCurrentGame = () => {
    this.userGame = this.field.getUserGame();
    this.dataBank.saveCurrentGame(this.currentGame, this.userGame, this.timer.timeData);
  };

  createMapOfGames(nonogramsArr) {
    const map = new Map();
    const arrGames = nonogramsArr.map((level) => level.games).flat();
    arrGames.forEach((game) => {
      const key = game.gameId;
      const dataGame = {
        level: game.level,
        gameName: game.gameName,
        gameMatrix: game.gameMatrix,
      };
      map.set(key, dataGame);
    });
    return map;
  }
}
