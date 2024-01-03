export function createHTMLElement(tag, classNames) {
  let elem = document.createElement(tag);
  elem.className = classNames;
  return elem;
}