import { createHTMLElement } from '../utils/createHTMLElement.js';
import { Hangman } from './Hangman.js';
import { Question } from './Question.js';
import { Keyboard } from './Keyboard.js';
import { Modal } from './Modal.js';
import { questions } from '../data/questions.js';

export class Main {
  constructor() {
    this.currInd = null;
    this.isEnd = false;
    this.createView();
    this.updateView();
  }

  createView() {
    const wrapper = createHTMLElement('div', 'wrapper', document.body);

    const title = createHTMLElement('h1', 'title', wrapper);
    title.innerText = `South Park Hangman`;
    const mainContent = createHTMLElement('main', 'main', wrapper);
    const gallowsBox = createHTMLElement('div', 'gallows-box', mainContent);

    this.questionBox = createHTMLElement('div', 'question-box', mainContent);
    this.keyBoardBox = createHTMLElement('div', 'keyboard-box', mainContent);

    this.hangman = new Hangman(gallowsBox);
    this.keyboard = new Keyboard(this.keyBoardBox);
    this.modal = new Modal(document.body);

    this.events();
  }

  updateView() {
    this.wrongAnswers = 0;
    this.currInd = this.getNewQuestion();

    this.questionBox.innerHTML = '';
    this.question = new Question(this.currInd, this.questionBox);
  }

  events() {
    this.keyBoardBox.addEventListener('click', this.clickOnVirtKeyboard.bind(this));

    document.body.addEventListener('keydown', this.clickOnPhysKeyboard.bind(this));

    this.modal.playBtn.addEventListener('click', this.runNewGame.bind(this));
  }

  getNewQuestion() {
    const l = questions.length;
    let randomInd;
    if (this.currInd !== null) {
      do {
        randomInd = Math.floor(Math.random() * l);
      } while (randomInd === this.currInd);
    } else {
      randomInd = Math.floor(Math.random() * l);
    }

    return randomInd;
  }

  clickOnPhysKeyboard(e) {
    if (this.isEnd) {
      return;
    }
    let physLetter = e.code[e.code.length - 1];
    if (this.keyboard.alphabet.includes(physLetter)) {
      let keyButton = this.keyboard.keyButtons.find((btn) => btn.innerText === physLetter);
      if (!keyButton.disabled) {
        this.checkLetter(physLetter, keyButton);
      }
    }
  }

  clickOnVirtKeyboard(e) {
    let targetBtn = e.target;
    if (!targetBtn.classList.contains('key')) {
      return;
    }
    let letter = targetBtn.innerText;

    this.checkLetter(letter, targetBtn);
  }

  checkLetter(letter, currButton) {
    let isLetter = this.question.answer.includes(letter);
    if (!isLetter) {
      this.wrongAnswers += 1;
      this.question.setGuesses(this.wrongAnswers);
      this.hangman.addNextPart(this.wrongAnswers - 1);
    } else {
      let answerArr = this.question.answer.split('');
      answerArr.forEach((currLetter, ind) => {
        if (currLetter === letter) {
          this.question.openLetter(ind);
        }
      });
    }
    currButton.disabled = true;
    this.checkGame();
  }

  checkGame() {
    if (this.wrongAnswers === 6) {
      this.hangman.addHalo();

      this.isEnd = 'fail';

      this.modal.showModal(this.isEnd, this.question.answer);
    }

    let isCorrect = this.question.checkWord();
    if (isCorrect) {
      this.isEnd = 'win';
      this.modal.showModal(this.isEnd, this.question.answer);
    }
  }

  runNewGame() {
    this.isEnd = false;
    this.updateView();
    this.hangman.hideMan();
    this.keyboard.updateView();
    this.modal.closeModal();
  }
}
