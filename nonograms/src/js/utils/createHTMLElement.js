export default function createHTMLElement(tag, classNames, parent, text = '') {
  const elem = document.createElement(tag);
  elem.className = classNames;
  elem.textContent = text;
  if (parent) {
    parent.append(elem);
  }
  return elem;
}
