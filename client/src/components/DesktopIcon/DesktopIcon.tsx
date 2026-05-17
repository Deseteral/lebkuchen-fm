import styles from './DesktopIcon.module.css';
import { AppIcon } from '@components/AppIcon/AppIcon';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';

interface DesktopIconProps {
  label: string;
  iconIndex: IconSpriteIndex;
  selected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  draggable?: boolean;
  onDragStart?: (e: DragEvent) => void;
  onDragOver?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  onDragEnd?: (e: DragEvent) => void;
}

function DesktopIcon(props: DesktopIconProps) {
  return (
    <button
      type="button"
      class={`${styles.app} ${props.selected ? styles.selected : ''}`}
      onClick={() => props.onClick()}
      onDblClick={() => props.onDoubleClick()}
      onKeyDown={(e) => e.key === 'Enter' && props.onDoubleClick()}
      draggable={props.draggable}
      onDragStart={props.onDragStart}
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
      onDragEnd={props.onDragEnd}
    >
      <AppIcon size={64} iconIndex={props.iconIndex} />
      <span class={styles.label}>{props.label}</span>
    </button>
  );
}

export { DesktopIcon };
