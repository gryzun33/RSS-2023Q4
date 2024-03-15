import { Props } from '../utils/types';

export default class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected element: T;
  protected children: BaseComponent[];

  constructor(props: Props) {
    this.element = document.createElement(props.tag || 'div') as T;
    this.setCssClasses(props.classNames);
    if (props.text !== null) {
      this.setTextContent(props.text);
    }
    this.children = [];
  }

  public getElement() {
    return this.element;
  }

  public getChildren() {
    return this.children;
  }

  public setCssClasses(cssClasses: string[] = []): void {
    cssClasses.map((cssClass) => this.element.classList.add(cssClass));
  }

  public setTextContent(text: string = '') {
    this.element.textContent = text;
  }

  public addClass(className: string): void {
    this.element.classList.add(className);
  }

  public toggleClass(className: string): void {
    this.element.classList.toggle(className);
  }

  public removeClass(className: string): void {
    this.element.classList.remove(className);
  }

  public append(...compChildren: BaseComponent[]) {
    compChildren.forEach((child) => {
      if (child instanceof BaseComponent) {
        this.element.append(child.element);
        this.children.push(child);
      }
    });
  }

  public insertBefore(newComp: BaseComponent, child: BaseComponent, index: number) {
    // console.log('newComp=', newComp);
    // console.log('child=', child);
    this.element.insertBefore(newComp.element, child.element);
    this.children[index] = newComp;
  }

  public attr(name: string, value?: string) {
    if (value) {
      this.element.setAttribute(name, value);
      return this;
    }
    return this.element.getAttribute(name);
  }

  getData(str: string) {
    // if (!this.element.dataset[str]) {
    //   throw new Error();
    // }
    return this.element.dataset[str];
  }

  css(prop: string, value: string) {
    this.element.style.setProperty(prop, value);
  }

  find(selector: string) {
    return this.element.querySelector(selector);
  }

  findAll(selector: string) {
    return [...this.element.querySelectorAll(selector)];
  }

  closest(selector: string) {
    return this.element.closest(selector);
  }

  on(eventType: string, callback: (event: Event) => void) {
    this.element.addEventListener(eventType, callback);
  }

  off(eventType: string, callback: (event: Event) => void) {
    this.element.removeEventListener(eventType, callback);
    // return this;
  }

  destroyChildren() {
    if (this.children.length > 0) {
      this.children.forEach((child) => {
        child.destroy();
      });
      this.children.length = 0;
    }
  }

  destroy() {
    // console.log('destroy=', this.element);
    this.destroyChildren();
    this.element.remove();
  }
}
