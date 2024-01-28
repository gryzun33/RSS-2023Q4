import createHTMLElement from '../utils/createHTMLElement';
import Timer from './Timer';

export default class Header {
  constructor(parent) {
    this.createView(parent);
  }

  createView(parent) {
    this.header = createHTMLElement('header', 'header', parent);
    this.btnBox = createHTMLElement('div', 'header-btn-box', this.header);

    // чекбокс
    this.switcher = createHTMLElement('label', 'switch', this.btnBox);
    this.inputTheme = createHTMLElement('input', 'input-theme', this.switcher);
    this.inputTheme.type = 'checkbox';
    this.slider = createHTMLElement('span', 'slider', this.switcher);

    this.title = createHTMLElement('h1', 'title', this.header, 'NONOGRAMS');
    this.timer = new Timer(this.header);
  }
}

// <label class="switch">
//   <input type="checkbox" class='input-theme'>
//   <span class="slider"></span>
// </label>
