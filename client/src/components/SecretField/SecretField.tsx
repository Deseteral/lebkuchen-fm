import { createSignal } from 'solid-js';
import { Input } from '@components/Input/Input';
import styles from './SecretField.module.css';

interface SecretFieldProps {
  suffix: string | null;
  secretLength: number | null;
  isSet: boolean;
  value: string | null;
  onChange: (value: string | null) => void;
}

function SecretField(props: SecretFieldProps) {
  const [isEditing, setIsEditing] = createSignal(false);
  const [draftValue, setDraftValue] = createSignal('');
  let inputRef!: HTMLInputElement;

  const maskedLength = () => Math.max((props.secretLength ?? 0) - (props.suffix?.length ?? 0), 0);

  const startEditing = () => {
    setDraftValue('');
    setIsEditing(true);
    props.onChange('');
    requestAnimationFrame(() => inputRef?.focus());
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDraftValue('');
    props.onChange(null);
  };

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const val = e.currentTarget.value;
    setDraftValue(val);
    props.onChange(val);
  };

  return (
    <div class={styles.container}>
      {isEditing() ? (
        <Input
          class={styles.editInput}
          ref={(el: HTMLInputElement) => (inputRef = el)}
          value={draftValue()}
          onInput={handleInput}
        />
      ) : (
        <div class={styles.maskedValue}>
          {props.isSet ? (
            <>
              <span class={styles.maskRegion}>{'•'.repeat(maskedLength())}</span>
              <span class={styles.suffixRegion}>{props.suffix}</span>
            </>
          ) : (
            <span class={styles.notSet}>not set</span>
          )}
        </div>
      )}
      <button
        class={styles.inlineButton}
        type="button"
        onClick={() => (isEditing() ? cancelEditing() : startEditing())}
      >
        {isEditing() ? 'Cancel' : 'Edit'}
      </button>
    </div>
  );
}

export { SecretField };
export type { SecretFieldProps };
