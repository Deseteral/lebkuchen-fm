import appIconsSpreadsheet from '../../icons/app-icons-spritesheet.png';
import { createEffect, createSignal } from 'solid-js';
import { IconSpriteIndex } from '@components/AppIcon/IconSpritesheet';

const ICON_SPREADSHEET_ROW_COUNT = 3;
const ICON_SPREADSHEET_COLUMN_COUNT = 4;

interface AppIconProps {
  size: number;
  iconIndex: IconSpriteIndex;
}

function AppIcon(props: AppIconProps) {
  const [iconStyle, setIconStyle] = createSignal<string>('');

  createEffect(() => {
    const backgroundPositionX = props.iconIndex.column * props.size;
    const backgroundPositionY = props.iconIndex.row * props.size;
    const backgroundWidth = ICON_SPREADSHEET_COLUMN_COUNT * props.size;
    const backgroundHeight = ICON_SPREADSHEET_ROW_COUNT * props.size;

    setIconStyle(`
      width: ${props.size}px;
      height: ${props.size}px;
      background-image: url(${appIconsSpreadsheet});
      background-position: ${-backgroundPositionX}px ${-backgroundPositionY}px;
      background-size: ${backgroundWidth}px ${backgroundHeight}px;
      image-rendering: pixelated;
    `);
  });

  return <div style={iconStyle()} />;
}

export { AppIcon };
