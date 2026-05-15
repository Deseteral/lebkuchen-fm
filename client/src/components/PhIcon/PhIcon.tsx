import clsx from 'clsx';
import styles from './PhIcon.module.css';

enum PhIconType {
  Bold = 'bold',
  Fill = 'fill',
}

interface PhIconProps {
  type: PhIconType;
  icon: string;
  size?: number;
}

function PhIcon(props: PhIconProps) {
  const size = () => `${props.size ?? 24}px`;

  return (
    <i
      class={clsx(styles.phIcon, `ph-${props.type}`, `ph-${props.icon}`)}
      style={{ width: size(), height: size(), 'line-height': size(), 'font-size': size() }}
    />
  );
}

export { PhIcon, PhIconType };
