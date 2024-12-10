import styles from './DesktopIcon.module.css';
import appIconsSpreadsheet from '../../icons/app-icons-spritesheet.png';

interface DesktopIconProps {
  label: string;
  buttonRef: (el: HTMLButtonElement) => HTMLButtonElement;
  toggleWindow: () => void;
  iconIndex: [number, number];
}

function DesktopIcon(props: DesktopIconProps) {
  // TODO: This value could be configurable (via theme maybe?).
  const iconSize = 64;

  const iconSpriteSheetRowColumnCount = 4;
  const backgroundPositionX = props.iconIndex[0] * iconSize;
  const backgroundPositionY = props.iconIndex[1] * iconSize;
  const backgroundSize = iconSpriteSheetRowColumnCount * iconSize;

  const iconStyle = `
    width: ${iconSize}px;
    height: ${iconSize}px;
    background-image: url(${appIconsSpreadsheet});
    background-position: ${-backgroundPositionX}px ${-backgroundPositionY}px;
    background-size: ${backgroundSize}px ${backgroundSize}px;
    image-rendering: pixelated;
  `;

  return (
    <button
      type="button"
      ref={props.buttonRef}
      class={styles.app}
      onDblClick={() => props.toggleWindow()}
      onKeyDown={(e) => e.key === 'Enter' && props.toggleWindow()}
    >
      <div style={iconStyle} />
      {props.label}
    </button>
  );
}

export { DesktopIcon };
