import styles from './TurnOffWidget.module.css';
import { UserAccountService } from '../../../../services/user-account-service';
import { PhIcon, PhIconType } from '@components/PhIcon/PhIcon';

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
      <PhIcon type={PhIconType.Bold} icon="power" />
    </button>
  );
}

export { TurnOffWidget };
