import createHTMLElement from '../utils/createHTMLElement';
import Field from './Field';
import nonograms from '../data/nonograms';

export default class Main {
  constructor(parent) {
    this.elem = null;
    this.currentGame = null;
    this.nonograms = nonograms;
    this.userGame = null;
    this.createView(parent);
    this.getRandomGame();
  }

  createView(parent) {
    this.elem = createHTMLElement('div', 'wrapper', parent);
    this.field = new Field(this.elem, this.nonograms[2].games[4]);

    // !!!!!test game
    this.currentGame = this.nonograms[2].games[4];

    this.configureFiew();
    this.events();
  }

  getHTMLElement() {
    return this.elem;
  }

  configureFiew() {
    this.userGame = this.field.getUserGame();
    console.log('usergame=', this.userGame);
  }

  events() {
    this.field.mainFieldTable.addEventListener('click', this.clickOnFieldLeft.bind(this));
  }

  clickOnFieldLeft(e) {
    // console.log('click on table');
    // console.log(e.target);

    if (e.target.closest('.cell')) {
      const cell = e.target.closest('.cell');
      cell.classList.toggle('cell-painted');
      const cellId = cell.id.split('-');
      console.log('cellid=', cellId);
      console.log('currentcell1=', this.userGame[cellId[0]][cellId[1]]);
      this.userGame[cellId[0]][cellId[1]] = this.userGame[cellId[0]][cellId[1]] ? 0 : 1;
      console.log('currentcell2=', this.userGame[cellId[0]][cellId[1]]);
      this.checkGame();
    }
  }

  checkGame() {
    const gameStr = this.currentGame.gameMatrix.flat().join('');
    console.log('gameStr', gameStr);
    const userGameStr = this.userGame.flat().join('');
    console.log('userGameStr', userGameStr);
    if (gameStr === userGameStr) {
      console.log('WIIINNN!!!!!!');
    } else {
      console.log('FAAAAIL!!!!!');
    }
  }

  getRandomGame() {
    const games = this.nonograms.map((level) => level.games).flat();
    // console.log('games=', games);
    let randNumber;
    if (this.currentGame !== null) {
      do {
        randNumber = Math.floor(Math.random() * games.length);
      } while (games[randNumber].gameId === this.currentGame.gameId);
    } else {
      randNumber = Math.floor(Math.random() * games.length);
    }
    console.log('game=', games[randNumber]);
    return games[randNumber];
  }
}
