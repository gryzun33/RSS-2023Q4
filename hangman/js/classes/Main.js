import { createHTMLElement } from "../utils/createHTMLElement.js";
import { Hangman } from "./Hangman.js";
import { Question } from "./Question.js";
import { Keyboard } from "./Keyboard.js";
import { questions } from "../data/questions.js";


console.log('hangman');


export class Main {
  constructor() {
      this.currInd = null;
      this.isEnd = false;
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
      this.keyBoardBox = createHTMLElement('div', 'keyboard-box', gameBox);
      // wrapper.append(title);
      // wrapper.append(mainContent);
      document.body.append(wrapper);

      this.hangman = new Hangman(gallowsBox);
      this.keyboard = new Keyboard(this.keyBoardBox);

      this.events();
  }

  updateView() {
    console.log('update');
    this.wrongAnswers = 0;
    this.currInd = this.getNewQuestion();
    this.questionBox.innerHTML = '';
    this.question = new Question (this.currInd, this.questionBox);
    console.log('question1 = ',this.question);
        
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
  
  events() {
    this.keyBoardBox.addEventListener('click', this.clickOnVirtKeyboard.bind(this));

    document.body.addEventListener('keydown', this.clickOnPhysKeyboard.bind(this));
  }

  clickOnPhysKeyboard(e) {
    let physLetter = e.code[e.code.length - 1];
    console.log(physLetter);
    if(this.keyboard.alphabet.includes(physLetter)) {

      let keyButton = this.keyboard.keyButtons.find((btn) => btn.innerText === physLetter);
      
      this.checkLetter(physLetter, keyButton);
    }
  }

  clickOnVirtKeyboard(e) {
    console.log('click');
    let targetBtn = e.target;
      if(!target.classList.contains('key')) {
        return;
      }
      let letter = target.innerText;
      console.log('letter=', letter);
      console.log('question2 =', this.question);
      this.checkLetter(letter, targetBtn);
      
  }

  checkLetter(letter, currButton) {

    let isLetter = this.question.answer.includes(letter);
      if(!isLetter) {
        console.log('wrong');
        this.wrongAnswers += 1;
        this.question.setGuesses(this.wrongAnswers);
        this.hangman.addNextPart(this.wrongAnswers-1);

      } else {
        let answerArr = this.question.answer.split('');
        answerArr.forEach((currLetter, ind) => {
          if(currLetter === letter) {
            this.question.openLetter(ind);
          }
        });

      }
      currButton.disabled = true;
      this.checkGame();
    
  }

  checkGame() {
    if(this.wrongAnswers === 6) {
      console.log('kenny hanged');
      this.hangman.addHalo();
      // setTimeout(() => {
        
      // },2000)
      this.isEnd = true;
    } 

    let isCorrect = this.question.checkWord();
    if(isCorrect) {
      console.log('kenny saved');
      this.isEnd = true;
    }
    
  }
}