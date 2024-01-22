import createHTMLElement from '../utils/createHTMLElement';
import Field from './Field';
import nonograms from '../data/nonograms';

export default class Main {
  constructor(parent) {
    this.elem = null;
    this.currentGame = null;
    this.nonograms = nonograms;
    // this.games = [];
    this.createView(parent);
    this.getRandomGame();
  }

  createView(parent) {
    this.elem = createHTMLElement('div', 'wrapper', parent);
    this.field = new Field(this.elem, this.nonograms[2].games[4]);
  }

  getHTMLElement() {
    return this.elem;
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
