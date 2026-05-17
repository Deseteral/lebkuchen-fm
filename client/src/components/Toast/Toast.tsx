import { AppNotification } from '../../types/notification';
import styles from './Toast.module.css';

interface ToastProps {
  notification: AppNotification;
  onDismiss: () => void;
  isClosing?: boolean;
}

function formatRelativeTime(timestamp: number): string {
  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSeconds < 10) return 'just now';
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function Toast(props: ToastProps) {
  return (
    <article class={styles.toast} classList={{ [styles.closing]: props.isClosing }}>
      <div class={styles.header}>
        <div>
          <p class={styles.title}>{props.notification.title}</p>
          <p class={styles.time}>{formatRelativeTime(props.notification.timestamp)}</p>
        </div>
        <button class={styles.close} type="button" onClick={props.onDismiss} aria-label="Dismiss">
          x
        </button>
      </div>
      <p class={styles.message}>{props.notification.message}</p>
    </article>
  );
}

export { Toast };
