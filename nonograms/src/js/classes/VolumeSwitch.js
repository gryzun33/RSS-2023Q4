import createHTMLElement from '../utils/createHTMLElement';

import iconVolume from '../../assets/icons/volume-low-solid.svg';
import iconNoVolume from '../../assets/icons/volume-xmark-solid.svg';

export default class VolumeSwitch {
  constructor(parent) {
    this.volumeBtn = null;
    this.createView(parent);
    // this.changeMute = changeMute;
  }

  createView(parent) {
    this.volumeBtn = createHTMLElement('div', 'volume-box', parent);
    this.volumeImg = createHTMLElement('img', 'volume-icon', this.volumeBtn);
    this.volumeImg.src = iconNoVolume;

    // this.volumeBtn.addEventListener('click', this.onClickVolumeBtn.bind(this));
  }

  getHTMLElement() {
    return this.volumeBtn;
  }

  changeView(isVolume) {
    this.volumeImg.src = isVolume ? iconVolume : iconNoVolume;
  }

  // onClickVolumeBtn() {
  //   this.changeView();
  //   this.changeMute();
  // }
}
