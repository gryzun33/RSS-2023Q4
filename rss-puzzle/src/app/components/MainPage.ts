import BaseComponent from './BaseComponent';
import Button from './Button';
import RowsIconsBox from './RowsIconsBox';
import ResultField from './ResultField';
import SourceBlock from './SourceBlock';
import { СallbackFunc } from '../utils/types';
import appState from './AppState';
import ContinueBtn from './ContinueBtn';
import CheckBtn from './CheckBtn';
import AutoCompleteBtn from './AutoCompleteBtn';
import LevelSelect from './LevelSelect';
import RoundSelect from './RoundSelect';
import Hints from './Hints';
import emitter from './EventEmitter';

export default class MainPage extends BaseComponent {
  // public resultField?: ResultField;
  // public sourceBlock?: SourceBlock;
  public sourceBlock = new SourceBlock();
  public resultField = new ResultField();
  public continueBtn?: ContinueBtn;
  public checkBtn?: CheckBtn;
  public autoBtn?: AutoCompleteBtn;
  public levelSelect?: LevelSelect;
  public roundSelect?: RoundSelect;

  protected isImageShowed: boolean = false;
  constructor(public reloadLoginPage: СallbackFunc) {
    super({ tag: 'div', classNames: ['main-page'] });
    this.createView();
    emitter.on('setNewRound', this.startNextRow);
  }

  protected createView() {
    const topPanel = new BaseComponent({ tag: 'div', classNames: ['top-panel'] });

    const selects = new BaseComponent({ tag: 'div', classNames: ['selects'] });
    this.levelSelect = new LevelSelect(appState.levels.length);
    this.roundSelect = new RoundSelect(appState.getNumbOfRounds());

    // console.log('levelselect=', this.levelSelect);
    // console.log('roundselect=', this.roundSelect);

    selects.append(this.levelSelect, this.roundSelect);

    const hints = new Hints();

    const logOutBtn = new Button({
      classNames: ['logout-btn'],
      text: 'Logout',
      callback: this.reloadLoginPage,
    });
    topPanel.append(selects, hints, logOutBtn);

    const resultBox = new BaseComponent({ tag: 'div', classNames: ['result-box'] });
    const rowsBox = new RowsIconsBox();

    resultBox.append(rowsBox, this.resultField);

    const bottomPanel = new BaseComponent({ tag: 'div', classNames: ['bottom-panel'] });

    this.continueBtn = new ContinueBtn({
      classNames: ['continue-btn'],
      text: 'Continue',
      disabled: true,
      callback: this.nextStep,
    });

    this.checkBtn = new CheckBtn({
      classNames: ['check-btn'],
      text: 'Check',
      disabled: true,
      callback: this.showIncorrectWords,
    });

    this.autoBtn = new AutoCompleteBtn({
      classNames: ['auto-btn', 'btn-show'],
      text: `I dont't know`,
      // disabled: true,
      callback: this.finishWithHint,
    });

    bottomPanel.append(this.continueBtn, this.checkBtn, this.autoBtn);

    this.append(topPanel, resultBox, this.sourceBlock, bottomPanel);

    this.startNextRow(false);
  }

  public startNextRow = (isSelected: unknown) => {
    if (typeof isSelected !== 'boolean') {
      throw new Error();
    }

    // console.log('startnextrow');
    // console.log(this.sourceBlock);
    // console.log(this.resultField);
    // if (this.sourceBlock && this.resultField) {

    const { currentText, row } = appState.getNextData(isSelected);
    const numbOfCells: number = currentText.split(' ').length;
    if (appState.row === 0) {
      // console.log('row=000000');
      this.resultField.updateView(row, numbOfCells);
    } else {
      this.resultField.setActiveRow(row, numbOfCells);
    }
    this.sourceBlock.createPuzzleRow(currentText);
    if (!isSelected && appState.row === 0) {
      if (!this.roundSelect || !this.levelSelect) {
        throw new Error('select is undefined');
      }
      this.roundSelect.setSelectValue(appState.round);
      this.levelSelect.setSelectValue(appState.level);
    }
    // console.log('appstate=', appState);
    // }
  };

  public nextStep = () => {
    if (appState.isLastRow() && !this.isImageShowed) {
      if (!this.resultField) {
        throw new Error('resultField is undefined');
      }
      if (!this.continueBtn) {
        throw new Error('contniueBtn is undefined');
      }
      if (!this.sourceBlock) {
        throw new Error('sourceBlock is undefined');
      }

      // console.log('nextstepimage');
      this.resultField.showFullImage();
      this.sourceBlock.showRoundData();
      this.continueBtn.disable();
      setTimeout(() => {
        this.continueBtn?.enable();
        this.isImageShowed = true;
      }, 1000);
    } else {
      // console.log('clickoncontinue');
      this.isImageShowed = false;
      this.autoBtn?.enable();
      appState.resetState();
      // console.log('appState1=', appState);
      this.startNextRow(false);
    }
    // if(isImageShowed)
  };

  public showIncorrectWords = () => {
    // const incorrect: number[] = appState.getIncorrectIndexes();
    // const pieces = this.resultField?.activeRow?.getChildren();
    // pieces?.forEach((piece, i) => {
    //   if (incorrect.includes(i)) {
    //     piece.addClass('piece-incorrect');
    //   }
    // });
    const pieces = this.resultField.activeRow?.getChildren();
    pieces?.forEach((piece) => {
      if (!appState.isCorrectPiece(piece)) {
        piece.addClass('piece-incorrect');
      }
    });
  };

  public finishWithHint = () => {
    console.log('finishwithhint');
    if (!this.resultField.activeRow) {
      throw new Error();
    }
    this.resultField.activeRow.append(...this.sourceBlock.getChildren());
    this.sourceBlock.clearChildren();

    const activeRowChildren = this.resultField.activeRow.getChildren();

    activeRowChildren.forEach((child) => {
      if (child.closest('.empty')) {
        child.destroy();
      } else {
        const elem = child.getElement();
        const order = appState.getCorrectIndex(elem);
        child.css('order', `${order}`);
        child.removeClass('piece-incorrect');
      }
    });
    this.checkBtn?.disable();
    // this.resultField?.activeRow?.showCorrectRow();
    appState.changeAfterHint();
    // this.isImageShowed = true;
  };

  // protected showChosenRound = () => {};
}
