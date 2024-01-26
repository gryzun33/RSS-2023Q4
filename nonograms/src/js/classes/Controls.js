import createHTMLElement from '../utils/createHTMLElement';
import ButtonElem from './ButtonElem';
import SelectLevel from './SelectLevel';
import SelectGame from './SelectGame';

export default class Controls {
  constructor(parent, startRandomGame, initChosenGame) {
    this.elem = null;
    this.randomBtn = null;
    // this.currentGame = currentGame;

    this.startRandomGame = startRandomGame;
    this.initChosenGame = initChosenGame;

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

    const randomBtnParams = {
      cssClasses: ['btn'],
      textContent: 'Random game',
      parent: this.elem,
      callback: this.startRandomGame,
    };
    console.log('function1= ', this.startRandomGame);
    this.randomBtn = new ButtonElem(randomBtnParams);

    console.log('randombtn=', this.randomBtn);
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
