import styles from './DesktopIcon.module.css';
import { AppIcon } from '@components/AppIcon/AppIcon';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';

interface DesktopIconProps {
  label: string;
  iconIndex: IconSpriteIndex;
  selected: boolean;
  removeMode?: boolean;
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
      class={`${styles.app} ${props.selected ? styles.selected : ''} ${props.removeMode ? styles.removeMode : ''}`}
      onClick={() => props.onClick()}
      onDblClick={() => props.onDoubleClick()}
      onKeyDown={(e) => e.key === 'Enter' && props.onDoubleClick()}
      draggable={props.draggable}
      onDragStart={(e) => props.onDragStart?.(e)}
      onDragOver={(e) => props.onDragOver?.(e)}
      onDrop={(e) => props.onDrop?.(e)}
      onDragEnd={(e) => props.onDragEnd?.(e)}
    >
      <AppIcon size={64} iconIndex={props.iconIndex} />
      <span class={styles.label}>{props.label}</span>
      {props.removeMode && <span class={styles.removeBadge}>-</span>}
    </button>
  );
}

export { DesktopIcon };
