import createHTMLElement from '../utils/createHTMLElement';
import Field from './Field';
import Controls from './Controls';
import Timer from './Timer';
import nonograms from '../data/nonograms';

export default class Main {
  constructor(parent) {
    this.isGame = false;
    this.mainElem = null;
    this.currentGame = null;
    this.nonograms = nonograms;
    this.userGame = null;
    this.createView(parent);

    this.gamesMap = this.createMapOfGames(this.nonograms);
    console.log('games=', this.gamesMap);
  }

  createView(parent) {
    this.mainElem = createHTMLElement('div', 'wrapper', parent);

    this.header = createHTMLElement('header', 'header', this.mainElem);
    this.title = createHTMLElement('h1', 'title', this.header, 'NONOGRAMS');

    this.gameWrapper = createHTMLElement('main', 'game-wrapper', this.mainElem);
    this.fieldWrapper = createHTMLElement('div', 'field-wrapper', this.gameWrapper);

    this.timer = new Timer(this.gameWrapper);
    this.controls = new Controls(this.gameWrapper, this.initRandomGame);
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
    } else {
      console.log('FAAAAIL!!!!!');
    }
  };

  initRandomGame = () => {
    this.currentGame = this.getRandomGame();
    this.initNewGame(this.currentGame);
  };

  initNewGame(game) {
    this.fieldWrapper.innerHTML = '';
    this.field = new Field(this.fieldWrapper, game, this.checkGame, this.startGame, this.isGame);
    // this.field.setCallbackToField(this.clickOnFieldLeft);
    // this.userGame = this.field.getUserGame();
  }

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

  createMapOfGames(nonogramsArr) {
    const map = new Map();
    const arrGames = nonogramsArr.map((level) => level.games).flat();
    arrGames.forEach((game) => {
      const key = game.gameId;
      const dataGame = {
        gameName: game.gameMatrix,
        gameMatrix: game.gameMatrix,
      };
      map.set(key, dataGame);
    });
    return map;
  }
}
