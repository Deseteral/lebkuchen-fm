import clsx from 'clsx';
import styles from './PhIcon.module.css';

enum PhIconType {
  Bold = 'bold',
  Fill = 'fill',
}

interface PhIconProps {
  type: PhIconType;
  icon: string;
}

function PhIcon(props: PhIconProps) {
  return <i class={clsx(styles.phIcon, `ph-${props.type}`, `ph-${props.icon}`)} />;
}

export { PhIcon, PhIconType };
