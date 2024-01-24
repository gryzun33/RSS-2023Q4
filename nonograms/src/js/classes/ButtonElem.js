import createHTMLElement from '../utils/createHTMLElement';

export default class ButtonElem {
  constructor(params) {
    this.elem = null;
    this.createElement(params);
  }

  createElement(params) {
    this.elem = document.createElement('button');
    this.setCssClasses([params.parent]);
    this.setTextContent(params.textContent);
    this.setCallback(params.callback);
    this.elem.append(params.parent);
  }

  getHTMLElement() {
    return this.elem;
  }

  setCssClasses(cssClasses = []) {
    cssClasses.map((cssClass) => this.elem.classList.add(cssClass));
  }

  setTextContent(text = '') {
    this.elem.textContent = text;
  }

  setCallback(callback) {
    this.elem.addEventListener('click', (event) => callback(event));
  }

  toggleState() {
    this.elem.disabled = !this.elem.disabled;
  }
}
