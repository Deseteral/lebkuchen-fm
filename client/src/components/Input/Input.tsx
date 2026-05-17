import styles from './Input.module.css';
import clsx from 'clsx';
import { Component, JSX, splitProps } from 'solid-js';

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

const Input: Component<InputProps> = (props) => {
  const [local, inputAttributes] = splitProps(props, ['children', 'class']);

  return <input {...inputAttributes} class={clsx(styles.input, local.class)} />;
};

export { Input };
