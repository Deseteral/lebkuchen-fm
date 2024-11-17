import powerOffIcon from '../../../../icons/power-off-solid.svg';
import styles from './TurnOffWidget.module.css';
import { UserAccountService } from '../../../../services/user-account-service';

function TurnOffWidget() {
  return (
    <button class={styles.buttonIcon} onClick={UserAccountService.userLogout}>
      <img class={styles.icon} src={powerOffIcon} alt="Uśpij. Nie wyłączaj!" />
    </button>
  );
}

export { TurnOffWidget };
