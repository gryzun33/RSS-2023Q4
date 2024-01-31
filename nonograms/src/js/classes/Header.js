import createHTMLElement from '../utils/createHTMLElement';
import Timer from './Timer';
import iconVolume from '../../assets/icons/volume-low-solid.svg';
import ThemeSwitch from './ThemeSwitch';

export default class Header {
  constructor(parent) {
    this.createView(parent);
  }

  createView(parent) {
    this.header = createHTMLElement('header', 'header', parent);
    this.btnBox = createHTMLElement('div', 'header-btn-box', this.header);

    // чекбокс
    this.switch = new ThemeSwitch(this.btnBox);

    // volume
    this.volumeBox = createHTMLElement('div', 'volume-box', this.btnBox);
    this.volumeBtn = createHTMLElement('img', 'volume-icon', this.volumeBox);
    this.volumeBtn.src = iconVolume;

    this.title = createHTMLElement('h1', 'title', this.header, 'NONOGRAMS');
    this.timer = new Timer(this.header);
  }
}
