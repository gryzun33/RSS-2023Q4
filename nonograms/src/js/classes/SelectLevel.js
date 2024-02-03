import createHTMLElement from '../utils/createHTMLElement';
import nonograms from '../data/nonograms';

export default class SelectLevel {
  constructor(parent, updateSelectGame) {
    this.elem = null;
    this.updateSelectGame = updateSelectGame;
    this.levels = nonograms.map((el) => el.numbCells);
    this.createView(parent);
  }

  createView(parent) {
    const selectWrapper = createHTMLElement('div', 'select-wrapper', parent);
    const selectLabel = createHTMLElement('label', 'select-label', selectWrapper, 'Choose level');
    this.elem = createHTMLElement('div', 'select-level', selectWrapper);
    this.selectContent = createHTMLElement('div', 'select-content', selectWrapper);

    this.levels.forEach((level) => {
      const label = createHTMLElement('label', 'option-label', this.selectContent, level);
      label.setAttribute('for', level);
      const inputItem = createHTMLElement('input', 'input', this.selectContent);
      inputItem.type = 'radio';
      inputItem.name = 'level';
      inputItem.id = level;
      inputItem.value = level;
      label.addEventListener('click', () => {
        this.elem.innerText = inputItem.value;
        this.hideList();
        this.updateSelectGame();
      });
    });

    this.elem.addEventListener('click', this.showList);

    document.body.addEventListener('click', (e) => {
      if (this.selectContent.classList.contains('list-visible') && e.target !== this.elem) {
        this.hideList();
      }
    });
  }

  setSelectValue(value) {
    this.elem.innerText = value;
  }

  showList = () => {
    this.selectContent.classList.toggle('list-visible');
  };

  hideList = () => {
    this.selectContent.classList.remove('list-visible');
  };
}
