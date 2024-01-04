import { createHTMLElement } from "../utils/createHTMLElement.js";
import { Hangman } from "./Hangman.js";
import { questions } from "../data/questions.js";

console.log('hangman');


export class Main {
  constructor() {
      this.currInd = null;
      this.createView();
  }

  createView() {
      const wrapper = createHTMLElement('div', 'wrapper');
      const title = createHTMLElement('h1', 'title');
      title.innerText = `Hangman`;
      const mainContent = createHTMLElement('main', 'main');
      wrapper.append(title);
      wrapper.append(mainContent);
      document.body.append(wrapper);

      const hangman = new Hangman(mainContent);
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