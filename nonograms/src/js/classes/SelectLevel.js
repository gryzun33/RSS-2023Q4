import createHTMLElement from '../utils/createHTMLElement';
import nonograms from '../data/nonograms';

export default class SelectLevel {
  constructor(parent, updateSelectGame) {
    this.elem = null;
    // this.data = data;
    this.updateSelectGame = updateSelectGame;
    this.levels = nonograms.map((el) => el.numbCells);
    this.createView(parent);
  }

  createView(parent) {
    const selectWrapper = createHTMLElement('div', 'select-wrapper', parent);
    const selectLabel = createHTMLElement('label', 'select-label', selectWrapper, 'Choose level');
    this.elem = createHTMLElement('select', 'select-level', selectWrapper);

    this.levels.forEach((level, i) => {
      const optionElem = createHTMLElement('option', 'option', this.elem, level);
      optionElem.value = level;
    });
    console.log('selectvalue=', this.elem.value);
    // this.elem.addEventListener('change', () => {
    //   console.log('selectvalue=', this.elem.value);
    // });

    this.elem.addEventListener('change', this.updateSelectGame);

    // this.setSelectValue('10 x 10');
  }

  setSelectValue(value) {
    this.elem.value = value;
  }

  // onChangeSelectLevel() {

  // }
}
