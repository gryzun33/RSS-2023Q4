import createHTMLElement from '../utils/createHTMLElement';
import nonograms from '../data/nonograms';

export default class SelectLevel {
  constructor(parent, data) {
    this.elem = null;
    this.data = data;
    this.levels = nonograms.map((el) => el.numbCells);
    this.createView(parent);
  }

  createView(parent) {
    const selectWrapper = createHTMLElement('div', 'select-wrapper', parent);
    const selectLabel = createHTMLElement('label', 'select-label', selectWrapper, 'Choose level');
    this.elem = createHTMLElement('select', 'select-level', selectWrapper);

    this.levels.forEach((level, i) => {
      const optionElem = createHTMLElement('option', 'option', this.elem, level);
      // const levelArr = level.split('x');
      optionElem.value = level;
      if (i === 0) {
        optionElem.selected = true;
      }
    });
    console.log('selectvalue=', this.elem.value);
    this.elem.addEventListener('change', () => {
      console.log('selectvalue=', this.elem.value);
    });
  }

  // setSelectValue(value) {
  //   this.elem.value = this.
  // }

  // onChangeSelectLevel() {

  // }
}
