import { createHTMLElement } from "../utils/createHTMLElement.js";
import { Hangman } from "./Hangman.js";
import { Question } from "./Question.js";
import { Keyboard } from "./Keyboard.js";
import { questions } from "../data/questions.js";


console.log('hangman');


export class Main {
  constructor() {
      this.currInd = null;
      this.answersCount = 0;
      this.createView();
      this.updateView();
  }

  createView() {
      const wrapper = createHTMLElement('div', 'wrapper');
      const title = createHTMLElement('h1', 'title', wrapper);
      title.innerText = `Hangman Game`;
      const mainContent = createHTMLElement('main', 'main', wrapper);
      const gallowsBox = createHTMLElement('div', 'gallows-box', mainContent);
      const gameBox = createHTMLElement('div', 'game-box', mainContent);
      this.questionBox = createHTMLElement('div', 'question-box', gameBox );
      const keyBoardBox = createHTMLElement('div', 'keyboard-box', gameBox);
      // wrapper.append(title);
      // wrapper.append(mainContent);
      document.body.append(wrapper);

      this.hangman = new Hangman(gallowsBox);
      this.keyboard = new Keyboard(keyBoardBox);
  }

  updateView() {
    this.currInd = this.getNewQuestion();
    this.questionBox.innerHTML = '';
    this.question = new Question (this.currInd, this.questionBox);
  }

  getNewQuestion() {
    const l = questions.length;
    let randomInd;
    if(this.currInd) {
      do {
        randomInd = Math.floor(Math.random() * l);
      } while (randomInd === this.currInd)
    } else {
      randomInd = Math.floor(Math.random() * l);
    }
   
    return randomInd; 
  } 
}