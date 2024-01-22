// import './index.html';
import './style.scss';

import Main from './js/classes/Main';

// function sum(a, b) {
//   return a + b;
// }

// sum(3, 4);

class App {
  constructor() {
    this.createView();
  }

  createView() {
    this.main = new Main(document.body);
    this.main.getHTMLElement();
  }
}
/* eslint no-unused-vars: "off" */
const app = new App();
