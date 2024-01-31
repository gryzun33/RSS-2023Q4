import createHTMLElement from '../utils/createHTMLElement';
import nonograms from '../data/nonograms';

export default class SelectGame {
  constructor(parent, startLevel, initChosenGame) {
    this.elem = null;
    this.nonograms = nonograms;
    this.initChosenGame = initChosenGame;
    this.levelMap = this.createLevelMap();
    this.createView(parent, startLevel);
  }

  createView(parent, startLevel) {
    const selectWrapper = createHTMLElement('div', 'select-wrapper', parent);
    const selectLabel = createHTMLElement('label', 'select-label', selectWrapper, 'Choose game');
    this.elem = createHTMLElement('select', 'select-game', selectWrapper);
    this.elem.addEventListener('change', this.initChosenGame);
    this.elem.disabled = true;
    this.updateView(startLevel);
  }

  updateView(level) {
    this.elem.innerHTML = '';
    this.gamesOfLevel = this.levelMap.get(level);
    this.emptyOption = createHTMLElement('option', 'option', this.elem);
    this.emptyOption.value = '';
    this.emptyOption.disabled = true;

    if (level) {
      this.gamesOfLevel.forEach((game) => {
        const optionElem = createHTMLElement('option', 'option', this.elem, game.gameName);
        optionElem.value = game.gameId;
      });
    }

    this.elem.value = '';
  }

  setSelectValue(id) {
    this.elem.value = id;
  }

  getSelectGameId() {
    return this.elem.value;
  }

  createLevelMap() {
    const levelMap = new Map();
    this.nonograms.forEach((level) => {
      levelMap.set(level.numbCells, level.games);
    });

    return levelMap;
  }
}
