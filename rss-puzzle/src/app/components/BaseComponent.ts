type CompProps = {
  tag: string;
  classNames: string[];
  textContent?: string;
};

export default class BaseComponent {
  public element: HTMLElement;

  constructor(props: CompProps) {
    this.element = document.createElement(props.tag);
    this.setCssClasses(props.classNames);
    this.setTextContent(props.textContent);
    // this.setCallback(props.callback);
  }

  getElement() {
    return this.element;
  }

  setCssClasses(cssClasses: string[] = []): void {
    cssClasses.map((cssClass) => this.element.classList.add(cssClass));
  }

  setTextContent(text: string = '') {
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
}
