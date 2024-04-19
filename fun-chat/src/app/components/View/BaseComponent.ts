import { Props, Handler, Listener } from '../../utils/types';
import emitter from '../EventEmitter';

type Unsubscriber = () => void;

export default class BaseComponent<T extends HTMLElement = HTMLElement> {
  public element: T;
  public children: BaseComponent[] = [];

  protected handlers: Handler[] = [];

  protected emitterMap: Map<string, Listener> = new Map();

  protected unsubscribes: Unsubscriber[] = [];

  constructor(props: Props) {
    this.element = document.createElement(props.tag || 'div') as T;
    this.addClasses(props.classNames);
    if (props.text !== null) {
      this.setTextContent(props.text);
    }
    // this.children = [];
  }

  protected addUnsubscribers() {
    this.emitterMap.forEach((listener, eventName) => {
      this.unsubscribes.push(emitter.on(eventName, listener));
    });
  }
  public getElement() {
    return this.element;
  }

  public getChildren() {
    return this.children;
  }

  public addClasses(cssClasses: string[] = []): void {
    cssClasses.map((cssClass) => this.element.classList.add(cssClass));
  }

  public setTextContent(text: string = ''): void {
    this.element.textContent = text;
  }

  public getTextContent() {
    return this.element.textContent;
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

  public insertBefore(newComp: BaseComponent, child: BaseComponent, index: number) {
    this.element.insertBefore(newComp.element, child.element);
    this.children[index] = newComp;
  }

  public attr(name: string, value?: string) {
    if (value) {
      this.element.setAttribute(name, value);
      // return this;
    }
    return this.element.getAttribute(name);
  }

  public removeAttr(name: string) {
    this.element.removeAttribute(name);
  }

  public css(prop: string, value: string) {
    this.element.style.setProperty(prop, value);
  }

  public findAll(selector: string) {
    return [...this.element.querySelectorAll(selector)];
  }

  public closest(selector: string) {
    return this.element.closest(selector);
  }

  public on(eventType: string, callback: (event: Event) => void) {
    this.element.addEventListener(eventType, callback);
    this.handlers.push({ eventType, callback });
  }

  public off(eventType: string, callback: (event: Event) => void) {
    this.element.removeEventListener(eventType, callback);
  }

  public html(html: string) {
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
    this.unsubscribeEmitter();
  }

  public unsubscribeEmitter(): void {
    this.unsubscribes.forEach((unsubscriber: Unsubscriber) => {
      unsubscriber();
    });
  }

  public deleteHandlers(): void {
    this.handlers.forEach((handler: Handler) => {
      this.off(handler.eventType, handler.callback);
    });
  }
}
