import appState from './AppState';
// import AudioComponent from './AudioComponent';
import BaseComponent from './BaseComponent';
import emitter from './EventEmitter';

// import BaseComponent from './BaseComponent';

// import appState from "./AppState";
export default class SoundHint extends BaseComponent {
  // audio = new Audio();
  protected audio = new Audio();
  // protected soundSrc: string = '';

  protected duration: number = 0;
  constructor() {
    super({ tag: 'button', classNames: ['sound-view'] });
    emitter.on('toggleSound', this.toggleVisibility);
    this.on('click', this.activateSoundHint);
    this.audio.addEventListener('ended', this.stopAnimation);
    if (!appState.hints.sound) {
      this.addClass('hint-view-hidden');
    }
  }

  public addSound = (row: number) => {
    const src = appState.getSoundSrc(row);
    this.audio.src = src;
    this.audio.onload = () => {
      this.duration = this.audio.duration;
    };
  };

  protected activateSoundHint = () => {
    this.audio.play();
    this.addClass('sound-view-active');
  };

  protected stopAnimation = () => {
    this.removeClass('sound-view-active');
  };

  protected toggleVisibility = () => {
    this.toggleClass('hint-view-hidden');
  };
}
