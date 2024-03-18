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
import Hints from './HintsButtons';
import TransaltionView from './TransaltionView';
import SoundHint from './SoundHint';
import ResultsModal from './ResultsModal';
import emitter from './EventEmitter';

export default class MainPage extends BaseComponent {
  // public resultField?: ResultField;
  // public sourceBlock?: SourceBlock;
  public sourceBlock = new SourceBlock();
  public resultField = new ResultField();

  public translationView = new TransaltionView();
  public hintsView = new BaseComponent({ tag: 'div', classNames: ['hints-view'] });
  public soundView = new SoundHint();
  public continueBtn?: ContinueBtn;
  public checkBtn?: CheckBtn;
  public autoBtn?: AutoCompleteBtn;

  public resultBtn?: Button;
  public levelSelect?: LevelSelect;
  public roundSelect?: RoundSelect;

  protected modal?: ResultsModal;

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

    selects.append(this.levelSelect, this.roundSelect);

    const hints = new Hints();

    const logOutBtn = new Button({
      classNames: ['logout-btn'],
      text: 'Logout',
      callback: this.reloadLoginPage,
    });
    topPanel.append(selects, hints, logOutBtn);

    const mainBox = new BaseComponent({ tag: 'div', classNames: ['main-box'] });

    this.hintsView.append(this.soundView, this.translationView);

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
      text: `Auto-Complete`,
      callback: this.finishWithHint,
    });

    this.resultBtn = new Button({
      classNames: ['result-btn'],
      text: `Results`,
      disabled: true,
      callback: this.createResultModal,
    });

    bottomPanel.append(this.continueBtn, this.checkBtn, this.autoBtn, this.resultBtn);

    mainBox.append(this.hintsView, resultBox, this.sourceBlock, bottomPanel);

    this.append(topPanel, mainBox);

    this.startNextRow(false);
  }

  public startNextRow = (isSelected: unknown) => {
    if (typeof isSelected !== 'boolean') {
      throw new Error();
    }
    this.hintsView.removeClass('hints-view-hidden');
    const { currentText, row } = appState.getNextData(isSelected);
    const numbOfCells: number = currentText.split(' ').length;
    if (appState.row === 0) {
      this.resultField.updateView(row, numbOfCells);
      appState.resetRoundStatistic();
    } else {
      this.resultField.setActiveRow(row, numbOfCells);
    }
    this.sourceBlock.createPuzzleRow(currentText);
    this.translationView.addTransaltion(row);
    this.soundView.addSound(row);

    if (!isSelected && appState.row === 0) {
      if (!this.roundSelect || !this.levelSelect) {
        throw new Error('select is undefined');
      }
      this.roundSelect.setSelectValue(appState.round);
      this.levelSelect.setSelectValue(appState.level);
    }
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
      this.resultField.showFullImage();
      this.sourceBlock.showRoundData();
      this.isImageShowed = true;
      this.hintsView.addClass('hints-view-hidden');
      this.resultBtn?.enable();
    } else {
      this.isImageShowed = false;
      appState.resetRowState();
      this.startNextRow(false);
      this.continueBtn?.disable();
      this.resultBtn?.disable();
      this.autoBtn?.enable();
    }
  };

  public showIncorrectWords = () => {
    const pieces = this.resultField.activeRow?.getChildren();
    pieces?.forEach((piece) => {
      if (!appState.isCorrectPiece(piece)) {
        piece.addClass('piece-incorrect');
      }
    });
  };

  public finishWithHint = () => {
    if (!this.resultField.activeRow) {
      throw new Error('activeRow is undefined');
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
    appState.changeAfterHint();
  };

  protected createResultModal = () => {
    this.modal = new ResultsModal(this.nextStep);
    document.body.append(this.modal.getElement());
  };
}
