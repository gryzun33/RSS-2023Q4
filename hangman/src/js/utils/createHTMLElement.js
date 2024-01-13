export default function createHTMLElement(tag, classNames, parent) {
  const elem = document.createElement(tag);
  elem.className = classNames;
  if (parent) {
    parent.append(elem);
  }
  return elem;
}
