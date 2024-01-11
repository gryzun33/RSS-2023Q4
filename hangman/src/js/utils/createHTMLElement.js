export function createHTMLElement(tag, classNames, parent) {
  let elem = document.createElement(tag);
  elem.className = classNames;
  if (parent) {
    parent.append(elem);
  }
  return elem;
}
