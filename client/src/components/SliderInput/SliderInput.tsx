import styles from './SliderInput.module.css';

interface SliderInputProps {
  children: string;
  value: number;
  onInput: (e: Event) => void;
  onChange: (e: Event) => void;
  min?: number;
  max?: number;
}

function SliderInput(props: SliderInputProps) {
  return (
    <label class={styles.label}>
      <input
        class={styles.slider}
        type="range"
        min={props.min || 1}
        max={props.max || 100}
        value={props.value}
        onInput={(e) => props.onInput(e)}
        onChange={(e) => props.onChange(e)}
      />
      {props.children}
    </label>
  );
}

export { SliderInput };
