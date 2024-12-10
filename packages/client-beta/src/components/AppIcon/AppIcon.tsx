import appIconsSpreadsheet from '../../icons/app-icons-spritesheet.png';
import { createEffect, createSignal } from 'solid-js';

const ICON_SPREADSHEET_ROW_COUNT = 2;
const ICON_SPREADSHEET_COLUMN_COUNT = 4;

interface AppIconProps {
  size: number;
  iconIndex: [number, number];
}

function AppIcon(props: AppIconProps) {
  const [iconStyle, setIconStyle] = createSignal<string>('');

  createEffect(() => {
    const backgroundPositionX = props.iconIndex[0] * props.size;
    const backgroundPositionY = props.iconIndex[1] * props.size;
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
