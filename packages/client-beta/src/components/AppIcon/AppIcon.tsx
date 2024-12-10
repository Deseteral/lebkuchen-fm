import appIconsSpreadsheet from '../../icons/app-icons-spritesheet.png';

interface AppIconProps {
  size: number;
  iconIndex: [number, number];
}

function AppIcon(props: AppIconProps) {
  const spriteSheetRowCount = 2;
  const spriteSheetColumnCount = 4;
  const backgroundPositionX = props.iconIndex[0] * props.size;
  const backgroundPositionY = props.iconIndex[1] * props.size;

  const iconStyle = `
    width: ${props.size}px;
    height: ${props.size}px;
    background-image: url(${appIconsSpreadsheet});
    background-position: ${-backgroundPositionX}px ${-backgroundPositionY}px;
    background-size: ${spriteSheetColumnCount * props.size}px ${spriteSheetRowCount * props.size}px;
    image-rendering: pixelated;
  `;

  return <div style={iconStyle} />;
}

export { AppIcon };
