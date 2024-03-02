import { Nullable } from './types';

export function getElementInFragment<T extends HTMLElement>(selector: string, parent: Node): T {
  if (!(parent instanceof DocumentFragment)) {
    throw new Error('parent of element is not instance of DocumentFragment');
  }
  const element: Nullable<T> = parent.querySelector(selector);

  if (!element) {
    throw new Error('element is undefined or null');
  }
  return element;
}
