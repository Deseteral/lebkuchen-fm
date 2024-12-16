import styles from './DesktopIcon.module.css';
import { AppIcon } from '@components/AppIcon/AppIcon';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';

interface DesktopIconProps {
  label: string;
  buttonRef: (el: HTMLButtonElement) => HTMLButtonElement;
  toggleWindow: () => void;
  iconIndex: IconSpriteIndex;
}

function DesktopIcon(props: DesktopIconProps) {
  return (
    <button
      type="button"
      ref={props.buttonRef}
      class={styles.app}
      onDblClick={() => props.toggleWindow()}
      onKeyDown={(e) => e.key === 'Enter' && props.toggleWindow()}
    >
      <AppIcon size={64} iconIndex={props.iconIndex} />
      {props.label}
    </button>
  );
}

export { DesktopIcon };
