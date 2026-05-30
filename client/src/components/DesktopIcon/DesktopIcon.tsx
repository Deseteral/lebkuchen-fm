import styles from './DesktopIcon.module.css';
import { AppIcon } from '@components/AppIcon/AppIcon';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';

interface DesktopIconProps {
  label: string;
  // TODO: Remove this props when migration to new system is completed.
  buttonRef?: (el: HTMLButtonElement) => HTMLButtonElement;
  onActivate: () => void;
  iconIndex: IconSpriteIndex;
}

function DesktopIcon(props: DesktopIconProps) {
  return (
    <button
      type="button"
      class={styles.app}
      onDblClick={() => props.onActivate()}
      onKeyDown={(e) => e.key === 'Enter' && props.onActivate()}
    >
      <AppIcon size={64} iconIndex={props.iconIndex} />
      {props.label}
    </button>
  );
}

export { DesktopIcon };
