import styles from './Toggle.module.css';

interface CheckboxProps {
  onChange: (e: Event) => void;
  children: string;
  checked: boolean;
}

function Toggle(props: CheckboxProps) {
  return (
    <label class={styles.label}>
      <input
        class={styles.checkbox}
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onChange(e)}
      />
      <span class={styles.toggle} />
      <span>{props.children}</span>
    </label>
  );
}

export { Toggle };
