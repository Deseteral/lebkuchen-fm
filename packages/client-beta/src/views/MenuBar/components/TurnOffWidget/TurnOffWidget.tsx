import powerOffIcon from '../../../../icons/power-off-solid.svg';
import styles from './TurnOffWidget.module.css';

function TurnOffWidget() {
  return (
    <button class={styles.buttonIcon}>
      <img class={styles.icon} src={powerOffIcon} alt="Uśpij. Nie wyłączaj!" />
    </button>
  );
}

export { TurnOffWidget };
