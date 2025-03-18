/* eslint-disable solid/reactivity */
import clsx from 'clsx';
import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import styles from './Button.module.css';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string | JSX.Element;
  primary?: boolean;
  withIcon?: boolean;
  withIconGrouped?: boolean;
}

const Button: Component<ButtonProps> = (_props) => {
  const props = mergeProps({ primary: false, withIcon: false }, _props);
  const [, buttonAttributes] = splitProps(props, [
    'children',
    'primary',
    'withIcon',
    'withIconGrouped',
  ]);
  const buttonClasses = clsx(
    styles.button,
    props.primary && styles.primary,
    props.withIcon && styles.withIcon,
    props.withIconGrouped && styles.grouped,
  );

  return (
    <button {...buttonAttributes} class={buttonClasses}>
      {props.children}
    </button>
  );
};

export { Button };
