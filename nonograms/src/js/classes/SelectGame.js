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
    this.elem = createHTMLElement('div', 'select-game', selectWrapper);
    this.selectContent = createHTMLElement('div', 'select-content', selectWrapper);
    this.elem.classList.add('select-disabled');
    this.updateView(startLevel);
    this.elem.addEventListener('click', this.showList);

    document.body.addEventListener('click', (e) => {
      if (this.selectContent.classList.contains('list-visible') && e.target !== this.elem) {
        this.hideList();
      }
    });
  }

  updateView(level) {
    this.elem.innerText = '';
    this.selectContent.innerHTML = '';
    this.gamesOfLevel = this.levelMap.get(level);

    if (level) {
      this.gamesOfLevel.forEach((game) => {
        const label = createHTMLElement('label', 'option-label', this.selectContent, game.gameName);
        label.setAttribute('for', `game-${game.gameId}`);
        const inputItem = createHTMLElement('input', 'input', this.selectContent);
        inputItem.type = 'radio';
        inputItem.name = 'level';
        inputItem.id = `game-${game.gameId}`;
        inputItem.value = game.gameId;
        label.addEventListener('click', () => {
          this.elem.innerText = label.innerText;
          this.initChosenGame(inputItem.value);
          this.hideList();
        });
      });
    }
  }

  setSelectValue(name) {
    this.elem.innerText = name;
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

  showList = () => {
    this.selectContent.classList.toggle('list-visible');
  };

  hideList = () => {
    this.selectContent.classList.remove('list-visible');
  };
}
