import createHTMLElement from '../utils/createHTMLElement';
import Modal from './Modal';

export default class ScoreModal extends Modal {
  constructor(parent, timer, isGame) {
    super(parent);
    // ???????
    this.timer = timer;
    this.isGame = isGame;
  }

  createContent() {
    this.content = createHTMLElement('div', 'score-modal-content', this.modalWrapper);
    this.title = createHTMLElement('h2', 'score-modal-title', this.content, 'Score table');

    // const headRow = createHTMLElement('tr', 'head-row', this.scoreTable);
  }

  updateContent(data) {
    if (this.modalText) {
      this.modalText.remove();
    }

    if (data.length === 0) {
      this.modalText = createHTMLElement('p', 'score-modal-text', this.content);
      this.modalText.innerText = 'No games won yet...';
      return;
    }

    if (this.scoreTable) {
      this.scoreTable.remove();
    }

    // this.scoreTable.innerHTML = '';
    this.scoreTable = createHTMLElement('table', 'score-table', this.content);
    const headRow = createHTMLElement('tr', 'head-row', this.scoreTable);
    const numbColumn = createHTMLElement('th', 'numb-cell', headRow, 'N');
    const nameColumn = createHTMLElement('th', 'name-cell', headRow, 'Game');
    const levelColumn = createHTMLElement('th', 'level-cell', headRow, 'Level');
    const timeColumn = createHTMLElement('th', 'time-cell', headRow, 'Time');

    data.forEach((game, i) => {
      const row = createHTMLElement('tr', 'score-row', this.scoreTable);
      const numb = createHTMLElement('td', 'numb-cell', row, `${i + 1}`);
      const name = createHTMLElement('td', 'name-cell', row, game.gameData.gameName);
      const level = createHTMLElement('td', 'level-cell', row, game.gameData.level);
      const time = createHTMLElement(
        'td',
        'time-cell',
        row,
        `${game.timeData.currMin}:${game.timeData.currSec}`
      );
    });
  }

  addClickHandler(isGame) {
    this.overlay.addEventListener(
      'click',
      (e) => {
        if (e.target === this.overlay || e.target === this.closeBtn || e.target === this.endBtn) {
          // console.log('closemodal');
          // this.closeModal();
          if (isGame) {
            this.timer.runTimer();
            console.log('runtimer');
          }
        }
      },
      { once: true }
    );
  }

  // closeModal() {

  // }
}
