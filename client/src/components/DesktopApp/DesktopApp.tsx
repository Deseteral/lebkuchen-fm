import { JSX, createSignal } from 'solid-js';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';
import { DesktopManager } from '../../services/desktop-manager';

interface DesktopAppProps {
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
}

function DesktopApp(props: DesktopAppProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  const closeWindow = () => {
    setIsOpen(false);
    props.onClose?.();
  };

  const handleActivate = () => {
    if (!DesktopManager.activateApp(props.id)) {
      setIsOpen(true);
    }
  };

  return (
    <>
      <DesktopIcon
        label={props.title}
        iconIndex={props.iconIndex}
        selected={DesktopManager.selectedIconId() === props.id}
        onClick={() => DesktopManager.selectIcon(props.id)}
        onDoubleClick={handleActivate}
      />
      {isOpen() && (
        <AppWindow
          appId={props.id}
          title={props.title}
          close={closeWindow}
          startSize={props.startSize}
          iconIndex={props.iconIndex}
          onRectChange={props.onRectChange}
        >
          {props.children}
        </AppWindow>
      )}
    </>
  );
}

export { DesktopApp };
export type { DesktopAppProps };
