import createHTMLElement from '../utils/createHTMLElement';
import Timer from './Timer';
import iconVolume from '../../assets/icons/volume-low-solid.svg';

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

    this.inputTheme.addEventListener('change', () => {
      console.log('change');
      document.body.classList.toggle('dark-theme');
    });

    // volume
    this.volumeBox = createHTMLElement('div', 'volume-box', this.btnBox);
    this.volumeBtn = createHTMLElement('img', 'volume-icon', this.volumeBox);
    this.volumeBtn.src = iconVolume;

    this.title = createHTMLElement('h1', 'title', this.header, 'NONOGRAMS');
    this.timer = new Timer(this.header);
  }
}

// <label class="switch">
//   <input type="checkbox" class='input-theme'>
//   <span class="slider"></span>
// </label>
