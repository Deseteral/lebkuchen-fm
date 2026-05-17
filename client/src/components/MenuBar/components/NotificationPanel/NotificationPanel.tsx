import { createSignal, For, Show, onCleanup, JSX, createEffect } from 'solid-js';
import { Portal } from 'solid-js/web';
import { NotificationService } from '../../../../services/notification-service';
import styles from './NotificationPanel.module.css';

function formatClockTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${hours}:${minutes}`;
}

interface NotificationPanelProps {
  trigger: JSX.Element;
}

function NotificationPanel(props: NotificationPanelProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isClosing, setIsClosing] = createSignal(false);
  let panelRef!: HTMLDivElement;

  createEffect(() => {
    if (isOpen()) {
      setIsClosing(false);
    }
  });

  const open = () => setIsOpen(true);
  const close = () => {
    if (!isOpen()) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 180);
  };
  const toggle = () => (isOpen() ? close() : open());

  const onClickOutside = (e: MouseEvent) => {
    if (isOpen() && panelRef && !panelRef.contains(e.target as Node)) {
      close();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen()) {
      close();
    }
  };

  document.addEventListener('click', onClickOutside, true);
  document.addEventListener('keydown', onKeyDown);

  onCleanup(() => {
    document.removeEventListener('click', onClickOutside, true);
    document.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div class={styles.container} ref={(el) => (panelRef = el)}>
      <button
        type="button"
        class={styles.trigger}
        classList={{ [styles.triggerActive]: isOpen() || isClosing() }}
        onClick={toggle}
        aria-label="Notifications"
      >
        {props.trigger}
      </button>
      <Show when={isOpen() || isClosing()}>
        <Portal mount={document.getElementById('toasts')!}>
          <section class={styles.panel} classList={{ [styles.panelClosing]: isClosing() }}>
            <div class={styles.header}>Notifications</div>
            <div class={styles.list}>
              <Show
                when={NotificationService.notifications().length > 0}
                fallback={<p class={styles.empty}>No notifications</p>}
              >
                <For each={NotificationService.notifications()}>
                  {(notification) => (
                    <article class={styles.item}>
                      <span class={styles.time}>{formatClockTime(notification.timestamp)}</span>
                      <div class={styles.content}>
                        <p class={styles.title}>{notification.title}</p>
                        <p class={styles.message}>{notification.message}</p>
                      </div>
                    </article>
                  )}
                </For>
              </Show>
            </div>
            <div class={styles.footer}>
              <button
                type="button"
                class={styles.clear}
                onClick={() => NotificationService.clearAll()}
              >
                Clear all
              </button>
            </div>
          </section>
        </Portal>
      </Show>
    </div>
  );
}

export { NotificationPanel };
