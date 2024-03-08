import BaseComponent from './BaseComponent';
// import puzzleImg from '../../assets/images/puzzle-svg.svg';
import puzzleImg from '../utils/icons';
import numbIconsOnStart from '../utils/constants';
import { storage } from './Storage';

export default class StartPage extends BaseComponent {
  constructor() {
    super({ tag: 'div', classNames: ['start-page'] });
    this.createView();
  }

  protected createView() {
    for (let i = 0; i < numbIconsOnStart; i += 1) {
      const puzzle = new BaseComponent({
        tag: 'div',
        classNames: ['start-puzzle'],
      });
      puzzle.getElement().innerHTML = puzzleImg;
      this.append(puzzle);
    }

    const title = new BaseComponent({ tag: 'h1', classNames: ['start-title'], text: 'RSS-Puzzle' });

    const userName = `${storage.getData('name')} ${storage.getData('surname')}`;
    const greeting = new BaseComponent({
      tag: 'p',
      classNames: ['start-greeting'],
      text: `Welcome ${userName}!`,
    });
    const rules1 = new BaseComponent({ tag: 'p', classNames: ['start-rules'] });
    const rules2 = new BaseComponent({ tag: 'p', classNames: ['start-rules'] });
    const rules3 = new BaseComponent({ tag: 'p', classNames: ['start-rules'] });
    const rulesText1 = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, earum delectus natus obcaecati consectetur sint dolorum aperiam vero, et porro exercitationem quos eos incidunt ab explicabo deserunt temporibus! Praesentium, repellat.`;
    rules1.setTextContent(rulesText1);
    rules2.setTextContent(rulesText1);
    rules3.setTextContent(rulesText1);
    this.append(title, greeting, rules1, rules2, rules3);
  }
}
