import BaseComponent from './BaseComponent';
import { WordData } from '../utils/types';
import appState from './AppState';
import emitter from './EventEmitter';
// import level1 from '../puzzle-data/wordCollectionLevel1.json';

export default class Piece extends BaseComponent {
  protected state: boolean = true;
  protected isImage: boolean = false;
  protected isInResult: boolean = false;
  public image?: BaseComponent<HTMLImageElement>;

  constructor(
    props: WordData,
    public parent: BaseComponent
  ) {
    super({ tag: 'div', classNames: ['piece'] });

    // this.attr('data-number', `${props.oldNumber}`);
    // this.attr('data-newnumber', `${props.newNumber}`);

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
    // document.addEventListener('click', handleClick, { once: true });
    if (!this.image) {
      throw new Error('image is undefined');
    }
    // const level: number = appState.level;
    // const round: number = appState.round;
    // const row: number = appState.row;
    // const src = levelsData[level].rounds[round].levelData.imageSrc;
    // const alt = levelsData[level].rounds[round].levelData.name;
    const { src, alt } = appState.getCurrentImageData();
    const fullSrc = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${src}`;
    // console.log('fullScr=', fullSrc);
    this.image.attr('src', fullSrc);
    this.image.attr('alt', alt);
    this.image.css('top', `${-row * 50}px`);
    this.image.css('left', `${-props.bgPositionX}%`);
    this.image.css('width', `${props.bgSize}%`);

    this.append(this.image);

    // this.css('background-image', `url(${fullSrc})`);
    // this.css('background-size', `${props.bgSize}% auto`);
    // this.css('background-position', `${-props.bgPositionX}% ${-row * 50}px`);
  }

  public toggleImage = () => {
    // const animationHandler = () => {
    //   console.log('animationhandler');
    //   this.removeClass('piece-image-active');
    //   this.image?.removeClass('hide-elem');
    // };

    if (!this.state) {
      return;
    }
    this.toggleClass('piece-image-active');

    // console.log('toggleimage');
    // if (!this.isImage) {
    //   this.addClass('piece-image-active');
    //   this.isImage = !this.isImage;
    // } else {
    //   this.isImage = !this.isImage;
    //   console.log('hidelelem');
    //   this.image?.addClass('hide-elem');
    // this.image?.on('animationend', animationHandler);
    // }
  };

  public changeStateInactive = () => {
    this.state = false;
    this.addClass('piece-image-active');
  };
}
