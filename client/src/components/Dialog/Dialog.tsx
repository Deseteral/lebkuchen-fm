import { Component } from 'solid-js';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { Button } from '@components/Button/Button';
import { PhIcon, PhIconType } from '@components/PhIcon/PhIcon';
import styles from './Dialog.module.css';

type DialogVariant = 'error' | 'success' | 'info' | 'confirm';

interface VariantConfig {
  icon: string;
  colorClass: string;
  defaultTitle: string;
}

const variantConfigs: Record<DialogVariant, VariantConfig> = {
  error: { icon: 'warning-octagon', colorClass: styles.iconError, defaultTitle: 'Error' },
  success: { icon: 'check-circle', colorClass: styles.iconSuccess, defaultTitle: 'Success' },
  info: { icon: 'info', colorClass: styles.iconInfo, defaultTitle: 'Info' },
  confirm: { icon: 'question', colorClass: styles.iconConfirm, defaultTitle: 'Confirm' },
};

interface DialogProps {
  variant: DialogVariant;
  title?: string;
  message: string;
  close: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
}

const Dialog: Component<DialogProps> = (props) => {
  const config = () => variantConfigs[props.variant];

  const handleOk = () => {
    if (props.variant === 'confirm' && props.onConfirm) {
      props.onConfirm();
    }
    props.close();
  };

  return (
    <AppWindow
      title={props.title ?? config().defaultTitle}
      close={props.close}
      centered
      startSize={{ width: '300px', height: '180px' }}
      phIcon={{ type: PhIconType.Bold, icon: config().icon }}
    >
      <div class={styles.container}>
        <div class={styles.body}>
          <span class={`${styles.icon} ${config().colorClass}`}>
            <PhIcon type={PhIconType.Bold} icon={config().icon} />
          </span>
          <p class={styles.message}>{props.message}</p>
        </div>
        <div class={styles.buttons}>
          {props.variant === 'confirm' && <Button onClick={() => props.close()}>Cancel</Button>}
          <Button onClick={handleOk}>{props.confirmLabel ?? 'OK'}</Button>
        </div>
      </div>
    </AppWindow>
  );
};

export { Dialog };
export type { DialogVariant, DialogProps };
