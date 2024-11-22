import powerOffIcon from '../../../../icons/power-off-solid.svg';
import styles from './TurnOffWidget.module.css';
import { UserAccountService } from '../../../../services/user-account-service';

function TurnOffWidget() {
  const showLogoutDialog = () => {
    const confirmed = confirm(
      'Are you sure you want to turn off your LebkuchenFM? Sleep mode would be a better idea.',
    );

    if (confirmed) {
      UserAccountService.userLogout();
    }
  };

  return (
    <button class={styles.buttonIcon} onClick={showLogoutDialog}>
      <img class={styles.icon} src={powerOffIcon} alt="Log out" />
    </button>
  );
}

export { TurnOffWidget };
