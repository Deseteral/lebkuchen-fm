import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

function css(input: TemplateStringsArray): string {
  const style = document.createElement('style');
  const className = nanoid();
  style.innerHTML = `.${className} { ${input[0]} }`;
  document.head.appendChild(style);

  return className;
}

export default css;
