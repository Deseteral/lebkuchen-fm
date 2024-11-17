import styles from './Input.module.css';
import { Component, JSX } from 'solid-js';

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

const Input: Component<InputProps> = (props) => {
  return <input {...props} class={styles.input} />;
};

export { Input };
