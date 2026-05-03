import { Component } from 'solid-js';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { Button } from '@components/Button/Button';
import { PhIcon, PhIconType } from '@components/PhIcon/PhIcon';
import { USER_MANAGER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import styles from './ErrorDialog.module.css';

interface ErrorDialogProps {
  message: string;
  close: () => void;
}

const ErrorDialog: Component<ErrorDialogProps> = (props) => {
  return (
    <AppWindow
      title="Error"
      close={props.close}
      centered
      startSize={{ width: '300px', height: '180px' }}
      iconIndex={USER_MANAGER_ICON_INDEX}
    >
      <div class={styles.container}>
        <div class={styles.body}>
          <span class={styles.icon}>
            <PhIcon type={PhIconType.Fill} icon="warning-circle" />
          </span>
          <p class={styles.message}>{props.message}</p>
        </div>
        <div class={styles.buttons}>
          <Button onClick={() => props.close()}>OK</Button>
        </div>
      </div>
    </AppWindow>
  );
};

export { ErrorDialog };
