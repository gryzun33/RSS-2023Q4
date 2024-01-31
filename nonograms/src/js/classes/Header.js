import createHTMLElement from '../utils/createHTMLElement';
import Timer from './Timer';
import VolumeSwitch from './VolumeSwitch';
import ThemeSwitch from './ThemeSwitch';

export default class Header {
  constructor(parent) {
    this.createView(parent);
  }

  createView(parent) {
    this.header = createHTMLElement('header', 'header', parent);
    this.btnBox = createHTMLElement('div', 'header-btn-box', this.header);
    this.switch = new ThemeSwitch(this.btnBox);
    this.volumeSwitch = new VolumeSwitch(this.btnBox);
    this.volumeBtn = this.volumeSwitch.getHTMLElement();
    this.title = createHTMLElement('h1', 'title', this.header, 'NONOGRAMS');
    this.timer = new Timer(this.header);
  }
}
