import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

function createStyle(name: string, content: string) {
  const style = document.createElement('style');
  style.innerHTML = `${name} { ${content} }`;
  document.head.appendChild(style);
}

function css(input: TemplateStringsArray): string {
  const className = nanoid();
  createStyle(`.${className}`, input[0]);

  return className;
}

String.prototype.onHover = function onHover(input: TemplateStringsArray): string { // eslint-disable-line no-extend-native
  createStyle(`.${this}:hover`, input[0]);
  return this.toString();
};

declare global {
  interface String {
    onHover(input: TemplateStringsArray): string,
  }
}

export default css;
