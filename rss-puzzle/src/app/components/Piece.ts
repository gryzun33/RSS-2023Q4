import BaseComponent from './BaseComponent';
import { WordData } from '../utils/types';
import appState from './AppState';
import emitter from './EventEmitter';

export default class Piece extends BaseComponent {
  protected state: boolean = true;
  public image?: BaseComponent<HTMLImageElement>;

  constructor(
    props: WordData,
    public parent: BaseComponent
  ) {
    super({ tag: 'div', classNames: ['piece'] });
    this.css('width', `${props.width}`);
    this.addText(props.word);
    this.addImage(props);
    appState.addToAppState(this, 'source', props.oldNumber, props.newNumber, props.word);

    emitter.on('toggleImage', this.toggleImage);
    emitter.on('iscorrect', this.changeStateInactive);

    if (appState.hints.image) {
      this.addClass('piece-image-active');
    }
  }

  addText(word: string) {
    const text = new BaseComponent({ tag: 'div', classNames: ['piece-text'], text: word });
    this.append(text);
  }

  addImage(props: WordData) {
    const { row } = appState;

    this.image = new BaseComponent<HTMLImageElement>({ tag: 'img', classNames: ['image-bg'] });

    if (!this.image) {
      throw new Error('image is undefined');
    }
    const { src, alt } = appState.getCurrentImageData();
    const fullSrc = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${src}`;
    this.image.attr('src', fullSrc);
    this.image.attr('alt', alt);
    this.image.css('top', `${-row * 100}%`);
    this.image.css('left', `${-props.bgPositionX}%`);
    this.image.css('width', `${props.bgSize}%`);
    this.append(this.image);
  }

  public toggleImage = () => {
    if (!this.state) {
      return;
    }
    this.toggleClass('piece-image-active');
  };

  public changeStateInactive = () => {
    this.state = false;
    this.addClass('piece-image-active');
  };
}
