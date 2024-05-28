import styles from './MessageBox.module.css';
import errorIcon from '../../../public/error-icon.png';
import clsx from 'clsx';

interface ErrorBubbleProps {
  type: 'login' | 'hint';
}

function MessageBox(props: ErrorBubbleProps) {
  return (
    <>
      {props.type === 'login' && (
        <div class={clsx(styles.box, styles.errorBox)}>
          <div class={styles.header}>
            <img class={styles.errorIcon} src={errorIcon} />
            <span>Did you forgot your password?</span>
          </div>
          <div class={styles.message}>
            <p>Fucking donkey. </p>
            <p>You can click "?" button to see your password hint.</p>
            <p class={styles.politeMessage}>Please type your password again.</p>
            <p>Be sure to use the correct uppercase and lowercase letters.</p>
          </div>
        </div>
      )}
      {props.type === 'hint' && (
        <div class={clsx(styles.box, styles.hintBox)}>
          <div class={styles.header}>
            <span>Password hint:</span>
          </div>
          <p>Double juicy asses and counting to three.</p>
        </div>
      )}
    </>
  );
}

export { MessageBox };
