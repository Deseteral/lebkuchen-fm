import styles from './Input.module.css';
import { Component, JSX, splitProps } from 'solid-js';

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

const Input: Component<InputProps> = (props) => {
  const [, inputAttributes] = splitProps(props, ['children']);

  return <input {...inputAttributes} class={styles.input} />;
};

export { Input };
