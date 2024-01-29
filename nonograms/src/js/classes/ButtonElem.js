// import createHTMLElement from '../utils/createHTMLElement';

export default class ButtonElem {
  constructor(params) {
    this.elem = null;
    this.createElement(params);
  }

  createElement(params) {
    // console.log('params=', params);
    this.elem = document.createElement('button');
    this.setCssClasses([params.cssClasses]);
    this.setTextContent(params.textContent);
    this.setCallback(params.callback);
    params.parent.append(this.elem);
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
    // console.log('callback =', typeof callback);
    this.elem.addEventListener('click', callback);
  }

  disableBtn() {
    this.elem.disabled = true;
  }

  enableBtn() {
    this.elem.disabled = false;
  }
}
