import { JSX, Show, For, onCleanup } from 'solid-js';
import styles from './MenuBarDropdown.module.css';

interface MenuBarDropdownItem {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface MenuBarDropdownSeparator {
  separator: true;
}

type MenuBarDropdownEntry = MenuBarDropdownItem | MenuBarDropdownSeparator;

interface MenuBarDropdownProps {
  trigger: JSX.Element;
  items: MenuBarDropdownEntry[];
  isOpen: boolean;
  onToggle: () => void;
  onHover: () => void;
  onClose: () => void;
}

function isSeparator(entry: MenuBarDropdownEntry): entry is MenuBarDropdownSeparator {
  return 'separator' in entry && entry.separator === true;
}

function MenuBarDropdown(props: MenuBarDropdownProps) {
  let dropdownRef!: HTMLDivElement;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      props.onClose();
    }
  };

  const onClickOutside = (e: MouseEvent) => {
    if (props.isOpen && dropdownRef && !dropdownRef.contains(e.target as Node)) {
      props.onClose();
    }
  };

  const onItemClick = (item: MenuBarDropdownItem) => {
    if (item.disabled) return;
    item.onClick?.();
    props.onClose();
  };

  document.addEventListener('click', onClickOutside, true);
  document.addEventListener('keydown', onKeyDown);

  onCleanup(() => {
    document.removeEventListener('click', onClickOutside, true);
    document.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div class={styles.container} ref={(el) => (dropdownRef = el)}>
      <button
        type="button"
        class={styles.trigger}
        classList={{ [styles.triggerActive]: props.isOpen }}
        onClick={() => props.onToggle()}
        onMouseEnter={() => props.onHover()}
      >
        {props.trigger}
      </button>
      <Show when={props.isOpen}>
        <div class={styles.menu}>
          <For each={props.items}>
            {(entry) =>
              isSeparator(entry) ? (
                <hr class={styles.separator} />
              ) : (
                <button
                  type="button"
                  class={styles.item}
                  classList={{ [styles.itemDisabled]: entry.disabled }}
                  onClick={() => onItemClick(entry)}
                  disabled={entry.disabled}
                >
                  {entry.label}
                </button>
              )
            }
          </For>
        </div>
      </Show>
    </div>
  );
}

export { MenuBarDropdown };
export type { MenuBarDropdownEntry };
