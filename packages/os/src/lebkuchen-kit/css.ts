import { customAlphabet } from 'nanoid';
import h from 'hyperscript';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

const cache: Record<string, string> = {};

function createStyle(name: string, content: string) {
  document.head.appendChild(h('style', `${name} { ${content} }`));
}

function css(input: TemplateStringsArray): string {
  const content = input[0];

  if (cache[content]) {
    return cache[content];
  }

  const className = nanoid();
  createStyle(`.${className}`, input[0]);
  cache[content] = className;
  return className;
}

String.prototype.onHover = function onHover(input: TemplateStringsArray): string { // eslint-disable-line no-extend-native
  const className = `.${this}:hover`;
  const content = input[0];

  if (Object.values(cache).includes(className)) {
    return this.toString();
  }

  createStyle(className, content);
  cache[content] = className;
  return this.toString();
};

declare global {
  interface String {
    onHover(input: TemplateStringsArray): string,
  }
}

export default css;
