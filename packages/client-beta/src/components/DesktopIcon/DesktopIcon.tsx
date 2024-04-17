import styles from './DesktopIcon.module.css';

interface DesktopIconProps {
  label: string;
  imgSrc: string;
  buttonRef: (el: HTMLButtonElement) => HTMLButtonElement
  toggleWindow: () => void
}

function DesktopIcon(props: DesktopIconProps) {
  return (
    <button
      type="button"
      ref={props.buttonRef}
      class={styles.app}
      onDblClick={()=> props.toggleWindow()}
      onKeyDown={(e) => e.key === 'Enter' && props.toggleWindow()}
    >
      <img
        class={styles.icon}
        src={props.imgSrc}
        alt=""
      />
      {props.label}
    </button>
  );
}

export { DesktopIcon };
