import BaseComponent from './BaseComponent';
import Button from './Button';
import { puzzleImg } from '../utils/icons';
import { numbIconsOnStart } from '../utils/constants';
import { storage } from './Storage';
import { СallbackFunc, PageName } from '../utils/types';
import startText from '../utils/textData';

export default class StartPage extends BaseComponent<HTMLElement> {
  constructor(private loadPage: СallbackFunc) {
    super({ tag: 'div', classNames: ['start-page'] });
    this.createView();
  }

  protected createView(): void {
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
    const rules = new BaseComponent({ tag: 'div', classNames: ['start-rules'] });

    rules.html(startText);

    const startBtn = new Button({
      classNames: ['start-btn'],
      text: 'Start',
      callback: () => this.loadPage(PageName.MAIN),
    });
    this.append(title, greeting, rules, startBtn);
  }
}
