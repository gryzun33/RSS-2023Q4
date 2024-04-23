import { Props, Handler } from '../utils/types';

export default class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected element: T;
  protected children: BaseComponent[];

  protected handlers: Handler[] = [];

  constructor(props: Props) {
    this.element = document.createElement(props.tag || 'div') as T;
    this.setCssClasses(props.classNames);
    if (props.text !== null) {
      this.setTextContent(props.text);
    }
    this.children = [];
  }

  public getElement(): T {
    return this.element;
  }

  public getChildren(): BaseComponent[] {
    return this.children;
  }

  public setCssClasses(cssClasses: string[] = []): void {
    cssClasses.map((cssClass) => this.element.classList.add(cssClass));
  }

  public setTextContent(text: string = ''): void {
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

  public append(...compChildren: BaseComponent[]): void {
    compChildren.forEach((child) => {
      if (child instanceof BaseComponent) {
        this.element.append(child.element);
        this.children.push(child);
      }
    });
  }

  public insertBefore(newComp: BaseComponent, child: BaseComponent, index: number): void {
    this.element.insertBefore(newComp.element, child.element);
    this.children[index] = newComp;
  }

  public attr(name: string, value?: string): void | string | null {
    if (value) {
      this.element.setAttribute(name, value);
    }
    return this.element.getAttribute(name);
  }

  public css(prop: string, value: string): void {
    this.element.style.setProperty(prop, value);
  }

  public findAll(selector: string): Element[] {
    return [...this.element.querySelectorAll(selector)];
  }

  public closest(selector: string): HTMLElement | null {
    return this.element.closest(selector);
  }

  public on(eventType: string, callback: (event: Event) => void): void {
    this.element.addEventListener(eventType, callback);
    this.handlers.push({ eventType, callback });
  }

  public off(eventType: string, callback: (event: Event) => void): void {
    this.element.removeEventListener(eventType, callback);
  }

  public html(html: string): void {
    this.element.innerHTML = html;
  }

  public destroyChildren(): void {
    if (this.children.length > 0) {
      this.children.forEach((child) => {
        child.destroy();
      });
      this.children.length = 0;
    }
  }

  public destroy(): void {
    this.destroyChildren();
    this.element.remove();
    this.deleteHandlers();
  }

  public deleteHandlers(): void {
    this.handlers.forEach((handler: Handler) => {
      this.off(handler.eventType, handler.callback);
    });
  }
}
