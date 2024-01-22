import createHTMLElement from '../utils/createHTMLElement';

export default class Field {
  constructor(parent, game) {
    this.gameField = null;

    this.game = game;
    this.userGame = [];
    this.addHints();
    this.createView(parent);
    console.log('left=', this.createLeftHintsArray(game.gameMatrix));
    console.log('top=', this.createTopHintsArray(game.gameMatrix));
  }

  createView(parent) {
    const fullField = createHTMLElement('table', 'full-field', parent);
    const rowFirst = createHTMLElement('tr', 'row-first', fullField);
    const rowSecond = createHTMLElement('tr', 'row-second', fullField);
    const emptyField = createHTMLElement('td', 'empty-field', rowFirst);
    // const emptyBox = createHTMLElement('div', 'empty-box', emptyField);

    // const emptyTable = createHTMLElement('table', 'empty-table', emptyField);
    // const emptyCell = createHTMLElement('table', 'empty-table', emptyField);
    const topHintsBigCell = createHTMLElement('td', 'top-hints', rowFirst);
    const topHintsTable = createHTMLElement('table', 'top-hints-table', topHintsBigCell);
    const leftHintsBigCell = createHTMLElement('td', 'left-hints', rowSecond);
    const leftHintsTable = createHTMLElement('table', 'left-hints-table', leftHintsBigCell);

    const mainFieldWrapper = createHTMLElement('td', 'main-field-wrapper', rowSecond);
    this.mainFieldTable = createHTMLElement('table', 'main-field-table', mainFieldWrapper);

    // render top hints
    for (let j = 0; j < this.topHints[0].length; j += 1) {
      const rowTopHints = createHTMLElement('tr', 'row-top-hints', topHintsTable);
      for (let i = 0; i < this.topHints.length; i += 1) {
        const text = this.topHints[i][j] ? this.topHints[i][j] : '';
        const rowTopHint = createHTMLElement('td', 'row-top-hint cell', rowTopHints, text);
      }
    }

    // render left hints
    for (let i = 0; i < this.leftHints.length; i += 1) {
      const rowLeftHints = createHTMLElement('tr', 'row-left-hints', leftHintsTable);

      for (let j = 0; j < this.leftHints[0].length; j += 1) {
        const text = this.leftHints[i][j] ? this.leftHints[i][j] : '';
        const rowLeftHint = createHTMLElement('td', 'row-left-hint cell', rowLeftHints, text);
      }
    }

    // render mainField
    for (let i = 0; i < this.game.gameMatrix.length; i += 1) {
      const userGameRow = [];
      const rowField = createHTMLElement('tr', 'field-row', this.mainFieldTable);
      for (let j = 0; j < this.game.gameMatrix.length; j += 1) {
        const cellField = createHTMLElement('td', 'field-cell cell', rowField);
        cellField.id = `${i}-${j}`;
        const cell = 0;
        userGameRow.push(cell);
      }
      this.userGame.push(userGameRow);
    }
    console.log('usergame=', this.userGame);
  }

  getUserGame() {
    return this.userGame;
  }

  addHints() {
    this.leftHints = this.createLeftHintsArray(this.game.gameMatrix);
    this.topHints = this.createTopHintsArray(this.game.gameMatrix);
  }

  createLeftHintsArray(matrix) {
    const arr = [];
    for (let i = 0; i < matrix.length; i += 1) {
      const row = [];
      let count = 0;
      for (let j = 0; j < matrix.length; j += 1) {
        if (count !== 0 && matrix[i][j] === 0) {
          row.push(count);
          count = 0;
        } else if (matrix[i][j] === 1 && j === matrix.length - 1) {
          count += matrix[i][j];
          row.push(count);
        } else {
          count += matrix[i][j];
        }
      }
      arr.push(row);
    }
    const maxLength = Math.max(...arr.map((el) => el.length));

    arr.forEach((el) => {
      while (el.length < maxLength) {
        el.unshift(0);
      }
    });
    return arr;
  }

  createTopHintsArray(matrix) {
    const arr = [];
    for (let j = 0; j < matrix.length; j += 1) {
      const column = [];
      let count = 0;
      for (let i = 0; i < matrix.length; i += 1) {
        if (count !== 0 && matrix[i][j] === 0) {
          column.push(count);
          count = 0;
        } else if (matrix[i][j] === 1 && i === matrix.length - 1) {
          count += matrix[i][j];
          column.push(count);
        } else {
          count += matrix[i][j];
        }
      }
      arr.push(column);
    }

    const maxLength = Math.max(...arr.map((el) => el.length));

    arr.forEach((el) => {
      while (el.length < maxLength) {
        el.unshift(0);
      }
    });
    return arr;
  }
}
