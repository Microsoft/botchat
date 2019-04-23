export default function createElement(tagName, attributes, ...children) {
  const element = document.createElement(tagName);

  Object.keys(attributes).forEach(name => {
    if (/^on[A-Z]/.test(name)) {
      element.addEventListener(name.substr(2).toLowerCase(), attributes[name].bind(element));
    } else {
      element[name] = attributes[name];
    }
  });

  children.forEach(child => element.appendChild(typeof child === 'string' ? document.createTextNode(child) : child));

  return element;
}
