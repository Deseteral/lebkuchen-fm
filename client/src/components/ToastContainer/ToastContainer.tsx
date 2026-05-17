import { For } from 'solid-js';
import { Portal } from 'solid-js/web';
import { NotificationService } from '../../services/notification-service';
import { Toast } from '../Toast/Toast';
import styles from './ToastContainer.module.css';

function ToastContainer() {
  const isClosing = (id: string) => NotificationService.closingToastIds().has(id);

  return (
    <Portal mount={document.getElementById('toasts')!}>
      <section class={styles.container} aria-live="polite">
        <For each={NotificationService.activeToasts()}>
          {(notification) => (
            <Toast
              notification={notification}
              isClosing={isClosing(notification.id)}
              onDismiss={() => NotificationService.dismissToast(notification.id)}
              onDismissComplete={() => NotificationService.finalizeToastDismiss(notification.id)}
            />
          )}
        </For>
      </section>
    </Portal>
  );
}

export { ToastContainer };
