import { type WindowHandle, WindowManagerOptions } from '@deseteral/biurko';
import { BiurkoDesktop, useWindowManager } from '@deseteral/biurko/adapters/solid-js';
import styles from './Desktop.module.css';
import { type JSX } from 'solid-js';

interface BiurkoDesktopProps {
  class?: string;
  children: JSX.Element;
}

function Desktop(props: BiurkoDesktopProps) {
  const options: WindowManagerOptions = {
    positionStrategy: { type: 'offset-from-focused', offsetX: 40, offsetY: 40 },
  };
  return (
    <BiurkoDesktop class={props.class} renderWindow={renderWindow} options={options}>
      {props.children}
    </BiurkoDesktop>
  );
}

function renderWindow(handle: WindowHandle, content: () => JSX.Element) {
  return (
    <>
      <TitleBar handle={handle} />
      <div class={styles.content}>{content()}</div>
    </>
  );
}

interface TitleBarProps {
  handle: WindowHandle;
}

function TitleBar(props: TitleBarProps) {
  const wm = useWindowManager();
  const title = () => wm.getWindowTitle(props.handle) ?? '';
  const close = () => wm.closeWindow(props.handle);

  return (
    <div class={styles.titleBar} data-biurko-drag-region>
      <div class={styles.titleText}>{title()}</div>
      <button type="button" class={styles.closeButton} onClick={close}>
        <span class={styles.closeButtonIcon}>+</span>
      </button>
    </div>
  );
}

export { Desktop };
