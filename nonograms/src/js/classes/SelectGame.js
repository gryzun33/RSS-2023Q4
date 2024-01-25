import createHTMLElement from '../utils/createHTMLElement';
import nonograms from '../data/nonograms';

export default class SelectGame {
  constructor(parent, startLevel) {
    this.elem = null;
    this.nonograms = nonograms;
    // this.currentGame = currentGame;
    this.levelMap = this.createLevelMap();
    this.createView(parent, startLevel);
  }

  createView(parent, startLevel) {
    const selectWrapper = createHTMLElement('div', 'select-wrapper', parent);
    const selectLabel = createHTMLElement('label', 'select-label', selectWrapper, 'Choose game');
    this.elem = createHTMLElement('select', 'select-game', selectWrapper);
    this.updateView(startLevel);
  }

  updateView(level) {
    this.elem.innerHTML = '';
    // this.level = `${currentGame.matrix.length} x ${currentGame.matrix.length}`;
    this.gamesOfLevel = this.levelMap.get(level);
    this.gamesOfLevel.forEach((game, i) => {
      const optionElem = createHTMLElement('option', 'option', this.elem, game.gameName);
      optionElem.value = game.gameId;
      // if (i === 0) {
      //   optionElem.selected = true;
      // }
    });

    console.log('selectGame=', this.elem.value);
    this.elem.addEventListener('change', () => {
      console.log('selectGame=', this.elem.value);
    });

    // this.setSelectGameValue(currentGame.id);
  }

  // setSelectGameValue(value = this.gamesOfLevel[0].gameId) {
  //   this.elem.value = value;
  // }

  setSelectGameId() {
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
