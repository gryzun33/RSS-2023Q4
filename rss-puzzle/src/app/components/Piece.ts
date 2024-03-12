import BaseComponent from './BaseComponent';
import { WordData } from '../utils/types';
import appState from './AppState';
// import level1 from '../puzzle-data/wordCollectionLevel1.json';

export default class Piece extends BaseComponent {
  protected isInResult: boolean = false;
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
  }

  addText(word: string) {
    const text = new BaseComponent({ tag: 'div', classNames: ['piece-text'], text: word });
    this.append(text);
  }

  addImage(props: WordData) {
    const { levelsData, level, round, row } = appState;
    const image = new BaseComponent<HTMLImageElement>({ tag: 'img', classNames: ['image-bg'] });

    // const level: number = appState.level;
    // const round: number = appState.round;
    // const row: number = appState.row;
    const src = levelsData[level].rounds[round].levelData.imageSrc;
    const alt = levelsData[level].rounds[round].levelData.name;
    const fullSrc = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${src}`;
    console.log('fullScr=', fullSrc);
    image.attr('src', fullSrc);
    image.attr('alt', alt);
    image.css('top', `${-row * 50}px`);
    image.css('left', `${-props.bgPositionX}%`);
    image.css('width', `${props.bgSize}%`);

    this.append(image);

    // this.css('background-image', `url(${fullSrc})`);
    // this.css('background-size', `${props.bgSize}% auto`);
    // this.css('background-position', `${-props.bgPositionX}% ${-row * 50}px`);
  }
}
