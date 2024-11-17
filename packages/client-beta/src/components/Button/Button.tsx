import clsx from 'clsx';
import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import styles from './Button.module.css';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  primary?: boolean;
}

const Button: Component<ButtonProps> = (_props) => {
  const props = mergeProps({ primary: false }, _props);
  const [, buttonAttributes] = splitProps(props, ['children', 'primary']);

  return (
    <button {...buttonAttributes} class={clsx(styles.button, props.primary && styles.primary)}>
      {props.children}
    </button>
  );
};

export { Button };
