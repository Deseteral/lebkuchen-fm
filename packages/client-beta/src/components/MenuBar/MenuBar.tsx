import styles from './MenuBar.module.css';
import { DateWidget } from './components/DateWidget/DateWidget';
import { TimeWidget } from './components/TimeWidget/TimeWidget';
import { VolumeWidget } from './components/VolumeWidget/VolumeWidget';
import { TurnOffWidget } from './components/TurnOffWidget/TurnOffWidget';

interface MenuBarProps {
  isUserLoggedIn: boolean;
}
function MenuBar(props: MenuBarProps) {
  return (
    <header class={styles.menuBar}>
      <section class={styles.leftSection}>
        {props.isUserLoggedIn && (
          <>
            <TurnOffWidget />
            <hr class={styles.verticalDivider} />
          </>
        )}
        <p>
          <strong>
            <i>LebkuchenFM</i>
          </strong>
        </p>
      </section>
      <section class={styles.rightSection}>
        {props.isUserLoggedIn && (
          <>
            <VolumeWidget />
            <hr class={styles.verticalDivider} />
          </>
        )}
        <DateWidget />
        <hr class={styles.verticalDivider} />
        <TimeWidget />
      </section>
    </header>
  );
}

export { MenuBar };
