import { JSX, Show } from 'solid-js';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';
import { getApplicationDefinition } from '../../apps/application-definitions';
import type { ApplicationId } from '../../apps/application-definitions';
import { ApplicationServer } from '../../services/application-server';

interface ApplicationWindowProps {
  id: ApplicationId;
  title?: string;
  iconIndex?: IconSpriteIndex;
  startSize: {
    width: string;
    height: string;
    minWidth?: string;
    minHeight?: string;
  };
  children: JSX.Element;
  onRectChange?: (x: number, y: number, width: number, height: number) => void;
  onClose?: () => void;
  persistWindowRect?: boolean;
}

function ApplicationWindow(props: ApplicationWindowProps) {
  const definition = () => getApplicationDefinition(props.id);
  const resolvedTitle = () => props.title ?? definition()?.title ?? props.id;
  const resolvedIconIndex = () => props.iconIndex ?? definition()?.iconIndex;
  const instance = () => ApplicationServer.getInstance(props.id);
  const isOpen = () => ApplicationServer.isOpen(props.id);
  const resolvedPersistWindowRect = () =>
    props.persistWindowRect ?? definition()?.persistWindowRect ?? true;

  const closeWindow = () => {
    props.onClose?.();
    ApplicationServer.close(props.id);
  };

  return (
    <Show when={isOpen()}>
      <AppWindow
        appId={props.id}
        title={resolvedTitle()}
        close={closeWindow}
        startSize={props.startSize}
        startPosition={instance()?.startPosition}
        iconIndex={resolvedIconIndex()}
        onRectChange={props.onRectChange}
        persistWindowRect={resolvedPersistWindowRect()}
      >
        {props.children}
      </AppWindow>
    </Show>
  );
}

export { ApplicationWindow };
export type { ApplicationWindowProps };
