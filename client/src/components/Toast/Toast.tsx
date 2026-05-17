import { AppNotification } from '../../types/notification';
import styles from './Toast.module.css';

interface ToastProps {
  notification: AppNotification;
  onDismiss: () => void;
  isClosing?: boolean;
}

function formatClockTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${hours}:${minutes}`;
}

function Toast(props: ToastProps) {
  return (
    <article class={styles.toast} classList={{ [styles.closing]: props.isClosing }}>
      <div class={styles.header}>
        <div>
          <p class={styles.title}>{props.notification.title}</p>
          {props.notification.sticky && (
            <p class={styles.time}>{formatClockTime(props.notification.timestamp)}</p>
          )}
        </div>
        <button
          class={styles.close}
          type="button"
          onClick={() => props.onDismiss()}
          aria-label="Dismiss"
        >
          x
        </button>
      </div>
      <p class={styles.message}>{props.notification.message}</p>
    </article>
  );
}

export { Toast };
