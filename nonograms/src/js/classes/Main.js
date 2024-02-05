import createHTMLElement from '../utils/createHTMLElement';
import Field from './Field';
import Controls from './Controls';
import Header from './Header';
import DataBank from './DataBank';
import FinishModal from './FinishModal';
import ScoreModal from './ScoreModal';
import Sounds from './Sounds';
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
    this.sounds = new Sounds();
    this.isVolume = false;
    this.createView(parent);
  }

  createView(parent) {
    this.mainWrapper = createHTMLElement('div', 'wrapper', parent);
    this.header = new Header(this.mainWrapper);
    this.timer = this.header.timer;
    this.volumeBtn = this.header.volumeBtn;
    this.volumeBtn.addEventListener('click', this.onClickVolumeBtn.bind(this));
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
      this.showScoreTable,
      this.sounds
    );
    this.initNewGame();
    this.finishModal = new FinishModal(document.body, this.sounds.finishSound);
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
  };

  checkGame = () => {
    this.userGame = this.field.getUserGame();
    const gameStr = this.currentGame.gameMatrix.flat().join('');
    const userGameStr = this.userGame
      .flat()
      .map((el) => el.data)
      .join('');
    if (gameStr === userGameStr) {
      this.finishGame();
      this.timer.stopTimer();
    }
  };

  initRandomGame = () => {
    this.currentGame = this.getRandomGame();

    // const gameName = this.currentGame.gameName;
    // const level = this.currentGame.level;
    // this.controls.updateSelects(level, gameName);

    this.initNewGame();
  };

  initChosenGame = (gameId) => {
    this.currentGame = this.gamesMap.get(+gameId);
    this.currentGame.gameId = +gameId;
    this.initNewGame();
  };

  initNewGame = () => {
    const gameName = this.currentGame.gameName;
    const level = this.currentGame.level;
    this.controls.updateSelects(level, gameName);

    this.timer.resetTimer();
    this.fieldWrapper.innerHTML = '';
    this.field = new Field(
      this.fieldWrapper,
      this.currentGame,
      this.checkGame,
      this.startGame,
      this.isGame,
      this.sounds
    );
    this.controls.saveGameBtn.disableBtn();
  };

  showLastGame = () => {
    const savedData = this.dataBank.getSavedGame();
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
    this.sounds.playSound(this.sounds.finishSound);
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

  onClickVolumeBtn() {
    this.isVolume = !this.isVolume;
    this.header.volumeSwitch.changeView(this.isVolume);
    this.sounds.changeMute();
  }
}
