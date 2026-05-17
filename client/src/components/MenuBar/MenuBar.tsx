import { Show, createSignal } from 'solid-js';
import styles from './MenuBar.module.css';
import { DateWidget } from './components/DateWidget/DateWidget';
import { TimeWidget } from './components/TimeWidget/TimeWidget';
import { VolumeWidget } from './components/VolumeWidget/VolumeWidget';
import { MenuBarDropdown } from './components/MenuBarDropdown/MenuBarDropdown';
import { PhIcon, PhIconType } from '@components/PhIcon/PhIcon';
import { Dialog } from '@components/Dialog/Dialog';
import { UserAccountService } from '../../services/user-account-service';
import { NotificationPanel } from './components/NotificationPanel/NotificationPanel';
import {
  activeAppId,
  activeAppTitle,
  resetActiveWindowPosition,
  closeActiveWindow,
} from '../../services/window-manager';

interface MenuBarProps {
  isUserLoggedIn: boolean;
}

function MenuBar(props: MenuBarProps) {
  const [showLogoutDialog, setShowLogoutDialog] = createSignal(false);
  const [openMenu, setOpenMenu] = createSignal<string | null>(null);

  const isOpen = (id: string) => openMenu() === id;
  const toggle = (id: string) => setOpenMenu(openMenu() === id ? null : id);
  const hover = (id: string) => {
    if (openMenu() !== null) setOpenMenu(id);
  };
  const close = () => setOpenMenu(null);

  return (
    <>
      <header class={styles.menuBar}>
        <section class={styles.leftSection}>
          {props.isUserLoggedIn && (
            <>
              <MenuBarDropdown
                trigger={<PhIcon type={PhIconType.Fill} icon="person-arms-spread" size={18} />}
                items={[
                  { label: 'About LebkuchenFM', disabled: true },
                  { separator: true },
                  { label: 'Log out', onClick: () => setShowLogoutDialog(true) },
                ]}
                isOpen={isOpen('logo')}
                onToggle={() => toggle('logo')}
                onHover={() => hover('logo')}
                onClose={close}
              />
              <hr class={styles.verticalDivider} />
            </>
          )}
          <Show
            when={activeAppId()}
            fallback={
              <p class={styles.appLabel}>
                <strong>LebkuchenFM</strong>
              </p>
            }
          >
            <MenuBarDropdown
              trigger={<strong>{activeAppTitle()}</strong>}
              items={[
                { label: `About ${activeAppTitle()}`, disabled: true },
                { separator: true },
                { label: 'Close', onClick: () => closeActiveWindow() },
              ]}
              isOpen={isOpen('app')}
              onToggle={() => toggle('app')}
              onHover={() => hover('app')}
              onClose={close}
            />
            <MenuBarDropdown
              trigger={<span>Window</span>}
              items={[{ label: 'Reset Position', onClick: () => resetActiveWindowPosition() }]}
              isOpen={isOpen('window')}
              onToggle={() => toggle('window')}
              onHover={() => hover('window')}
              onClose={close}
            />
            <MenuBarDropdown
              trigger={<span>Help</span>}
              items={[{ label: 'No help available', disabled: true }]}
              isOpen={isOpen('help')}
              onToggle={() => toggle('help')}
              onHover={() => hover('help')}
              onClose={close}
            />
          </Show>
        </section>
        <section class={styles.rightSection}>
          {props.isUserLoggedIn && (
            <>
              <VolumeWidget />
              <hr class={styles.verticalDivider} />
            </>
          )}
          <span class={styles.collapsible}>
            <DateWidget />
            <hr class={styles.verticalDivider} />
          </span>
          <NotificationPanel trigger={<TimeWidget />} />
        </section>
      </header>

      <Show when={showLogoutDialog()}>
        <Dialog
          variant="confirm"
          title="Log out"
          message="Are you sure you want to turn off your LebkuchenFM? Sleep mode would be a better idea."
          confirmLabel="Log out"
          close={() => setShowLogoutDialog(false)}
          onConfirm={() => UserAccountService.userLogout()}
        />
      </Show>
    </>
  );
}

export { MenuBar };
