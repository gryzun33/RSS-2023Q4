// import btnClick from '../../assets/audio/btn-click.mp3';
import clickLeftFill from '../../assets/audio/click-left-fill.mp3';
import clickLeftClear from '../../assets/audio/click-left-clear.mp3';
import clickRightFill from '../../assets/audio/click-right-fill.mp3';
import clickRightClear from '../../assets/audio/click-right-clear.mp3';
import finishSound from '../../assets/audio/finish-game-2.mp3';

export default class Sounds {
  constructor() {
    this.soundsArr = [];
    this.createSounds();
  }

  createSounds() {
    // this.btnClick = document.createElement('audio');
    // this.btnClick.src = btnClick;
    // this.soundsArr.push(this.btnClick);

    this.clickLeftFill = document.createElement('audio');
    this.clickLeftFill.src = clickLeftFill;
    this.soundsArr.push(this.clickLeftFill);

    this.clickLeftClear = document.createElement('audio');
    this.clickLeftClear.src = clickLeftClear;
    this.soundsArr.push(this.clickLeftClear);

    this.clickRightFill = document.createElement('audio');
    this.clickRightFill.src = clickRightFill;
    this.soundsArr.push(this.clickRightFill);

    this.clickRightClear = document.createElement('audio');
    this.clickRightClear.src = clickRightClear;
    this.soundsArr.push(this.clickRightClear);

    this.finishSound = document.createElement('audio');
    this.finishSound.src = finishSound;
    this.soundsArr.push(this.finishSound);

    this.changeMute();
  }

  changeMute = () => {
    this.soundsArr.forEach((sound) => {
      sound.muted = !sound.muted;
    });
  };

  playSound(sound) {
    sound.currentTime = 0;
    sound.play();
  }
}
