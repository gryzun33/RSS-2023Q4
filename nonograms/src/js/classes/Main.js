import createHTMLElement from '../utils/createHTMLElement';
import Field from './Field';
import Controls from './Controls';
import nonograms from '../data/nonograms';

export default class Main {
  constructor(parent) {
    this.elem = null;
    this.currentGame = null;
    this.nonograms = nonograms;
    this.userGame = null;
    this.createView(parent);

    this.gamesMap = this.createMapOfGames(this.nonograms);
    console.log('games=', this.gamesMap);
  }

  createView(parent) {
    this.elem = createHTMLElement('div', 'wrapper', parent);

    this.header = createHTMLElement('header', 'header', this.elem);
    this.title = createHTMLElement('h1', 'title', this.header, 'NONOGRAMS');

    this.gameWrapper = createHTMLElement('main', 'game-wrapper', this.elem);
    this.fieldWrapper = createHTMLElement('div', 'field-wrapper', this.gameWrapper);

    this.timerWrapper = createHTMLElement('div', 'timer-wrapper', this.gameWrapper, '00:00');
    this.controls = new Controls(this.gameWrapper, this.startRandomGame);
  }

  getHTMLElement() {
    return this.elem;
  }

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

  startRandomGame = () => {
    this.currentGame = this.getRandomGame();
    this.startNewGame(this.currentGame);
  };

  startNewGame(game) {
    this.fieldWrapper.innerHTML = '';
    this.field = new Field(this.fieldWrapper, game, this.checkGame);
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
