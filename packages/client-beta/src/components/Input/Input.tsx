import styles from './Input.module.css';
import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import clsx from 'clsx';

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  minimal?: boolean;
}

const Input: Component<InputProps> = (_props) => {
  const props = mergeProps({ minimal: false }, _props);
  const [, inputAttributes] = splitProps(props, ['children', 'minimal']);

  return <input {...inputAttributes} class={clsx(styles.input, props.minimal && styles.minimal)} />;
};

export { Input };
