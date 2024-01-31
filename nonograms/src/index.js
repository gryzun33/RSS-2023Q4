import './style.scss';

import Main from './js/classes/Main';

class App {
  constructor() {
    this.createView();
  }

  createView() {
    this.main = new Main(document.body);
  }
}
/* eslint no-unused-vars: "off" */
const app = new App();
