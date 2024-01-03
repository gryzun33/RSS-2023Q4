import { createHTMLElement } from "../utils/createHTMLElement.js";

console.log('hangman');


export class Main {
  constructor() {
      this.createView();
  }

  createView() {
      const wrapper = createHTMLElement('main', 'wrapper');
      const title = createHTMLElement('h1', 'title');
      title.innerText = `Hangman`;
      wrapper.append(title);
      document.body.append(wrapper);

      
  }
}