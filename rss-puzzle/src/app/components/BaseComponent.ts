import { Props } from '../utils/types.ts';

export default class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected element: T;

  constructor(props: Props) {
    this.element = document.createElement(props.tag || 'div') as T;
    this.setCssClasses(props.classNames);
    if (props.text !== null) {
      this.setTextContent(props.text);
    }
  }

  public getElement() {
    return this.element;
  }

  public setCssClasses(cssClasses: string[] = []): void {
    cssClasses.map((cssClass) => this.element.classList.add(cssClass));
  }

  public setTextContent(text: string = '') {
    this.element.textContent = text;
  }

  public addClass(className: string): void {
    this.element.classList.toggle(className);
  }

  public toggleClass(className: string): void {
    this.element.classList.toggle(className);
  }

  public removeClass(className: string): void {
    this.element.classList.remove(className);
  }

  public append(...children: BaseComponent[]) {
    children.forEach((child) => {
      if (child instanceof BaseComponent) {
        // child = child.element;
        this.element.append(child.element);
      }
    });
  }

  public attr(name: string, value: string) {
    if (value) {
      this.element.setAttribute(name, value);
      return this;
    }
    return this.element.getAttribute(name);
  }
}
