import { createHTMLElement } from "../utils/createHTMLElement.js";
import { Hangman } from "./Hangman.js";

console.log('hangman');


export class Main {
  constructor() {
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
}