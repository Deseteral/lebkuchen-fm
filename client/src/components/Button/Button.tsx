import clsx from 'clsx';
import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import styles from './Button.module.css';

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Underlined = 'underlined',
}

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  fullWidth?: boolean;
  variant?: ButtonVariant;
}

const getVariantClassName = (variant: ButtonVariant): string => {
  switch (variant) {
    case ButtonVariant.Primary:
      return styles.primary;
    case ButtonVariant.Secondary:
      return styles.secondary;
    case ButtonVariant.Underlined:
      return styles.underlined;
    default:
      return '';
  }
};

const Button: Component<ButtonProps> = (_props) => {
  const props = mergeProps({ fullWidth: false, variant: ButtonVariant.Primary }, _props);
  const [, buttonAttributes] = splitProps(props, ['children', 'fullWidth', 'variant']);

  return (
    <button
      {...buttonAttributes}
      class={clsx(
        styles.button,
        props.fullWidth && styles.fullWidth,
        getVariantClassName(props.variant),
      )}
    >
      {props.children}
    </button>
  );
};

export { Button };
