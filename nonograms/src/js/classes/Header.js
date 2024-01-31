import createHTMLElement from '../utils/createHTMLElement';
import Timer from './Timer';
import VolumeSwitch from './VolumeSwitch';
import ThemeSwitch from './ThemeSwitch';

export default class Header {
  constructor(parent) {
    this.createView(parent);
    // this.changeMute = changeMute;
  }

  createView(parent) {
    this.header = createHTMLElement('header', 'header', parent);
    this.btnBox = createHTMLElement('div', 'header-btn-box', this.header);

    // чекбокс
    this.switch = new ThemeSwitch(this.btnBox);
    this.volumeSwitch = new VolumeSwitch(this.btnBox);
    this.volumeBtn = this.volumeSwitch.getHTMLElement();
    // volume
    // this.volumeBox = createHTMLElement('div', 'volume-box', this.btnBox);
    // this.volumeBtn = createHTMLElement('img', 'volume-icon', this.volumeBox);
    // this.volumeBtn.src = iconVolume;

    this.title = createHTMLElement('h1', 'title', this.header, 'NONOGRAMS');
    this.timer = new Timer(this.header);
  }
}
