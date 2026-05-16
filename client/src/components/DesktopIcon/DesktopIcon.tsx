import styles from './DesktopIcon.module.css';
import { AppIcon } from '@components/AppIcon/AppIcon';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';

interface DesktopIconProps {
  label: string;
  iconIndex: IconSpriteIndex;
  selected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

function DesktopIcon(props: DesktopIconProps) {
  return (
    <button
      type="button"
      class={`${styles.app} ${props.selected ? styles.selected : ''}`}
      onClick={() => props.onClick()}
      onDblClick={() => props.onDoubleClick()}
      onKeyDown={(e) => e.key === 'Enter' && props.onDoubleClick()}
    >
      <AppIcon size={64} iconIndex={props.iconIndex} />
      <span class={styles.label}>{props.label}</span>
    </button>
  );
}

export { DesktopIcon };
