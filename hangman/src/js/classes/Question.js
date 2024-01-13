import { questions } from '../data/questions.js';
import { createHTMLElement } from '../utils/createHTMLElement.js';

export class Question {
  constructor(currInd, parent) {
    this.hint = questions[currInd].question;
    this.answer = questions[currInd].answer;
    console.log('Answer=', this.answer);
    this.letters = [];
    this.maxGuesses = 6;
    this.createView(parent);
  }

  createView(parent) {
    const questionInner = createHTMLElement('div', 'question', parent);

    const answerElem = createHTMLElement('div', 'answer-box', questionInner);

    for (let i = 0; i < this.answer.length; i += 1) {
      let letterBox = createHTMLElement('div', 'letter-box letter-border', answerElem);
      let letterObj = {
        letter: '',
        elem: letterBox,
      };
      this.letters.push(letterObj);
    }

    const hintElem = createHTMLElement('div', 'hint', questionInner);
    hintElem.innerText = `${this.hint}`;
    const incorrGuesses = createHTMLElement('div', 'guesses', questionInner);
    const guessText = createHTMLElement('p', 'guess-text', incorrGuesses);
    guessText.innerHTML = `Incorrect guesses:&nbsp;&nbsp;`;
    this.guessCountElem = createHTMLElement('p', 'guess-count', incorrGuesses);
    this.guessCountElem.innerText = '0';
    const guessMaxElem = createHTMLElement('p', 'guess-max', incorrGuesses);
    guessMaxElem.innerText = ` / ${this.maxGuesses}`;
  }

  setGuesses(count) {
    this.guessCountElem.innerText = count;
  }

  openLetter(ind) {
    this.letters[ind].letter = this.answer[ind];
    this.letters[ind].elem.innerText = this.answer[ind];
    this.letters[ind].elem.classList.remove('letter-border');
  }

  checkWord() {
    let guessWord = this.letters.map((el) => el.letter).join('');
    if (guessWord === this.answer) {
      return true;
    }
    return false;
  }
}
