import { createHTMLElement } from "./js/createHTMLElement.js";

console.log('hangman');


class MainPage {
  constructor() {
      this.createView();
  }

  createView() {
      const wrapper = createHTMLElement('div', 'wrapper');
      const title = createHTMLElement('h1', 'title');
      title.innerText = `Hangman`;
      wrapper.append(title);
      document.body.append(wrapper);

      
  }
}

const mainPage = new MainPage();