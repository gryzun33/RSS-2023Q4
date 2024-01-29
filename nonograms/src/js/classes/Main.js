import createHTMLElement from '../utils/createHTMLElement';
import Field from './Field';
import Controls from './Controls';
import Header from './Header';
import DataBank from './DataBank';
import FinishModal from './FinishModal';
import ScoreModal from './ScoreModal';

import nonograms from '../data/nonograms';

export default class Main {
  constructor(parent) {
    this.isGame = false;
    this.mainElem = null;
    this.currentGame = null;
    this.nonograms = nonograms;
    this.currentGame = this.nonograms[0].games[0];
    this.userGame = null;
    this.gamesMap = this.createMapOfGames(this.nonograms);
    this.dataBank = new DataBank();

    this.createView(parent);
  }

  createView(parent) {
    this.mainWrapper = createHTMLElement('div', 'wrapper', parent);
    this.header = new Header(this.mainWrapper);
    this.timer = this.header.timer;
    this.gameWrapper = createHTMLElement('main', 'game-wrapper', this.mainWrapper);
    this.fieldWrapper = createHTMLElement('div', 'field-wrapper', this.gameWrapper);

    this.controls = new Controls(
      this.gameWrapper,
      this.initRandomGame,
      this.initChosenGame,
      this.initNewGame,
      this.saveCurrentGame,
      this.showLastGame,
      this.showSolution,
      this.showScoreTable
    );
    this.initNewGame();
    this.finishModal = new FinishModal(document.body);
    this.scoreModal = new ScoreModal(document.body, this.timer, this.isGame);
    if (!this.dataBank.getSavedGame()) {
      this.controls.lastGameBtn.disableBtn();
    }
  }

  getHTMLElement() {
    return this.mainElem;
  }

  startGame = () => {
    this.isGame = true;
    this.timer.runTimer();
    this.controls.saveGameBtn.enableBtn();
    // console.log('start game');
  };

  checkGame = () => {
    this.userGame = this.field.getUserGame();
    const gameStr = this.currentGame.gameMatrix.flat().join('');
    console.log('gameStr', gameStr);

    const userGameStr = this.userGame
      .flat()
      .map((el) => el.data)
      .join('');
    // console.log('userGameStr', userGameStr);
    console.log('usergameStr', gameStr);
    if (gameStr === userGameStr) {
      // console.log('WIIINNN!!!!!!');
      this.finishGame();
      this.timer.stopTimer();
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
    this.controls.saveGameBtn.disableBtn();

    // this.field.setCallbackToField(this.clickOnFieldLeft);
    // this.userGame = this.field.getUserGame();
  };

  showLastGame = () => {
    const savedData = this.dataBank.getSavedGame();
    // console.log('saveddata=', savedData);
    this.isGame = false;
    this.currentGame = savedData.gameData;
    this.initNewGame();
    this.timer.updateTimer(savedData.timeData.min, savedData.timeData.sec);
    this.field.updateUserGameView(savedData.usergameData);
  };

  showSolution = () => {
    this.isGame = false;
    this.timer.resetTimer();
    this.field.showCorrectField();
    this.field.disableField();
    this.controls.saveGameBtn.disableBtn();
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
    this.field.disableField();
    this.controls.saveGameBtn.disableBtn();
    const timeInSec = this.timer.getTimeInSec();
    setTimeout(() => {
      this.finishModal.showModal(timeInSec);
    }, 500);
  }

  saveCurrentGame = () => {
    if (!this.dataBank.getSavedGame()) {
      this.controls.lastGameBtn.enableBtn();
    }
    this.userGame = this.field.getUserGame();
    this.dataBank.saveCurrentGame(this.currentGame, this.userGame, this.timer.timeData);
  };

  showScoreTable = () => {
    const data = this.dataBank.getFinishedGames();
    data.sort((a, b) => a.fullTime - b.fullTime);
    // this.savedGames.sort((a, b) => a.fullTime - b.fullTime);
    console.log('datals=', data);
    this.scoreModal.showModal(data);
    this.scoreModal.addClickHandler(this.isGame);
    this.timer.stopTimer();
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
