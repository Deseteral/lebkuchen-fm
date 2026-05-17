import { createSignal, For, Show, JSX, createEffect, onCleanup } from 'solid-js';
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
  let containerRef!: HTMLDivElement;
  let panelRef: HTMLElement | undefined;

  const isVisible = () => isOpen() || isClosing();

  const open = () => {
    setIsClosing(false);
    setIsOpen(true);
  };

  const close = () => {
    if (!isOpen() || isClosing()) return;
    setIsClosing(true);
  };

  const toggle = () => (isOpen() ? close() : open());

  const onClickOutside = (e: MouseEvent) => {
    if (!isVisible()) return;

    const target = e.target as Node;
    if (containerRef.contains(target) || panelRef?.contains(target)) return;

    close();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isVisible()) {
      close();
    }
  };

  createEffect(() => {
    if (!isVisible()) return;

    document.addEventListener('click', onClickOutside, true);
    document.addEventListener('keydown', onKeyDown);

    onCleanup(() => {
      document.removeEventListener('click', onClickOutside, true);
      document.removeEventListener('keydown', onKeyDown);
    });
  });

  onCleanup(() => {
    document.removeEventListener('click', onClickOutside, true);
    document.removeEventListener('keydown', onKeyDown);
  });

  const onPanelAnimationEnd = (event: AnimationEvent) => {
    if (event.currentTarget !== event.target) return;
    if (!isClosing()) return;

    setIsOpen(false);
    setIsClosing(false);
  };

  return (
    <div class={styles.container} ref={(el) => (containerRef = el)}>
      <button
        type="button"
        class={styles.trigger}
        classList={{ [styles.triggerActive]: isOpen() || isClosing() }}
        onClick={toggle}
        aria-label="Notifications"
      >
        {props.trigger}
      </button>
      <Show when={isVisible()}>
        <Portal mount={document.getElementById('toasts')!}>
          <section
            ref={(el) => (panelRef = el)}
            class={styles.panel}
            classList={{ [styles.panelClosing]: isClosing() }}
            onAnimationEnd={onPanelAnimationEnd}
          >
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
