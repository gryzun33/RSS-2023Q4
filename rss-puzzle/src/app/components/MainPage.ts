import BaseComponent from './BaseComponent';
import Button from './Button';
import RowsIconsBox from './RowsIconsBox';
import ResultField from './ResultField';
import SourceBlock from './SourceBlock';
import { СallbackFunc } from '../utils/types';
import appState from './AppState';

export default class MainPage extends BaseComponent {
  constructor(public reloadLoginPage: СallbackFunc) {
    super({ tag: 'div', classNames: ['main-page'] });
    this.createView();
  }

  protected createView() {
    const topPanel = new BaseComponent({ tag: 'div', classNames: ['top-panel'] });
    const logOutBtn = new Button({
      classNames: ['logout-btn'],
      text: 'Logout',
      callback: this.reloadLoginPage,
    });
    topPanel.append(logOutBtn);

    const resultBox = new BaseComponent({ tag: 'div', classNames: ['result-box'] });
    const rowsBox = new RowsIconsBox();
    const resultField = new ResultField();
    resultBox.append(rowsBox, resultField);

    const sourceBlock = new SourceBlock();

    const bottomPanel = new BaseComponent({ tag: 'div', classNames: ['bottom-panel'] });

    this.append(topPanel, resultBox, sourceBlock, bottomPanel);

    sourceBlock.createPuzzleRow(appState.getCurrentText());
    resultField.setActiveRow(appState.row);
  }

  // protected updateView() {
  //   sourceBlock.createPuzzleRow(appState.getCurrentText());
  // }
}
