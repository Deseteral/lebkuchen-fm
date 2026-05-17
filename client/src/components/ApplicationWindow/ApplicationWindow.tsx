import { JSX, createSignal, onMount } from 'solid-js';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';
import { DesktopManager } from '../../services/desktop-manager';
import { activateWindow } from '../../services/window-manager';

interface ApplicationWindowProps {
  id: string;
  title: string;
  iconIndex: IconSpriteIndex;
  startSize: {
    width: string;
    height: string;
    minWidth?: string;
    minHeight?: string;
  };
  children: JSX.Element;
  onRectChange?: (x: number, y: number, width: number, height: number) => void;
  onClose?: () => void;
  showIcon?: boolean;
  persistWindowRect?: boolean;
  startPosition?: { x: number; y: number };
  autoOpen?: boolean;
}

function ApplicationWindow(props: ApplicationWindowProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  onMount(() => {
    if (props.autoOpen) {
      setIsOpen(true);
    }
  });

  const closeWindow = () => {
    setIsOpen(false);
    props.onClose?.();
  };

  const handleActivate = () => {
    if (!activateWindow(props.id)) {
      setIsOpen(true);
    }
  };

  return (
    <>
      {props.showIcon !== false && (
        <DesktopIcon
          label={props.title}
          iconIndex={props.iconIndex}
          selected={DesktopManager.selectedIconId() === props.id}
          onClick={() => DesktopManager.selectIcon(props.id)}
          onDoubleClick={handleActivate}
        />
      )}
      {isOpen() && (
        <AppWindow
          appId={props.id}
          title={props.title}
          close={closeWindow}
          startSize={props.startSize}
          startPosition={props.startPosition}
          iconIndex={props.iconIndex}
          onRectChange={props.onRectChange}
          persistWindowRect={props.persistWindowRect}
        >
          {props.children}
        </AppWindow>
      )}
    </>
  );
}

export { ApplicationWindow };
export type { ApplicationWindowProps };
