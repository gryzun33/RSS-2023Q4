import createHTMLElement from '../utils/createHTMLElement';
import ButtonElem from './ButtonElem';
import SelectLevel from './SelectLevel';
import SelectGame from './SelectGame';

export default class Controls {
  constructor(
    parent,
    startRandomGame,
    initChosenGame,
    initNewGame,
    saveCurrentGame,
    showLastGame,
    showSolution
  ) {
    this.elem = null;
    this.randomBtn = null;
    // this.currentGame = currentGame;

    this.startRandomGame = startRandomGame;
    this.initChosenGame = initChosenGame;
    this.initNewGame = initNewGame;
    this.saveCurrentGame = saveCurrentGame;
    this.showLastGame = showLastGame;
    this.showSolution = showSolution;

    this.createView(parent);
  }

  createView(parent) {
    this.elem = createHTMLElement('div', 'controls-wrapper', parent);

    this.selectBox = createHTMLElement('div', 'select-box', this.elem);

    this.selectLevel = new SelectLevel(this.selectBox, this.updateSelectGame);
    // console.log('ffff=', this.selectLevel.elem.value);
    this.selectGame = new SelectGame(
      this.selectBox,
      this.selectLevel.elem.value,
      this.initChosenGame
    );

    this.btnBox = createHTMLElement('div', 'btn-box', this.elem);
    const randomBtnParams = {
      cssClasses: ['btn'],
      textContent: 'Random game',
      parent: this.btnBox,
      callback: this.startRandomGame,
    };
    this.randomBtn = new ButtonElem(randomBtnParams);

    const resetBtnParams = {
      cssClasses: ['btn'],
      textContent: 'Reset game',
      parent: this.btnBox,
      callback: this.initNewGame,
    };
    this.resetBtn = new ButtonElem(resetBtnParams);

    const saveGameBtnParams = {
      cssClasses: ['btn'],
      textContent: 'Save game',
      parent: this.btnBox,
      callback: this.saveCurrentGame,
    };
    this.saveGameBtn = new ButtonElem(saveGameBtnParams);

    const lastGameBtnParams = {
      cssClasses: ['btn'],
      textContent: 'Continue last game',
      parent: this.btnBox,
      callback: this.showLastGame,
    };
    this.lastGameBtn = new ButtonElem(lastGameBtnParams);

    const solutionBtnParams = {
      cssClasses: ['btn'],
      textContent: 'Solution',
      parent: this.btnBox,
      callback: this.showSolution,
    };
    this.solutionBtn = new ButtonElem(solutionBtnParams);

    const scoreBtnParams = {
      cssClasses: ['btn'],
      textContent: 'Score table',
      parent: this.btnBox,
      // callback: this.showSolution,
    };
    this.scoreBtn = new ButtonElem(scoreBtnParams);
  }

  updateSelectGame = () => {
    this.selectGame.updateView(this.selectLevel.elem.value);
    // this.selectGame.setSelectValue(8);
  };

  updateSelects(level, gameId) {
    this.selectLevel.setSelectValue(level);
    this.selectGame.updateView(level);
    this.selectGame.setSelectValue(gameId);
  }
}
