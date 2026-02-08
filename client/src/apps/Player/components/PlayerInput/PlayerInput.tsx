import styles from './PlayerInput.module.css';
import { Component, JSX, splitProps } from 'solid-js';

interface PlayerInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

const PlayerInput: Component<PlayerInputProps> = (props) => {
  const [, inputAttributes] = splitProps(props, ['children']);

  return <input {...inputAttributes} class={styles.playerInput} />;
};

export { PlayerInput };
