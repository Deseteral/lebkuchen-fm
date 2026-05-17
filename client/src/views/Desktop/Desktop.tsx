import { For, createSignal, onCleanup, onMount } from 'solid-js';
import styles from './Desktop.module.css';
import { UserAccountService } from '../../services/user-account-service';
import { MenuBar } from '@components/MenuBar/MenuBar';
import { SocketConnectionClient } from '../../services/socket-connection-client';
import { PlayXSoundEventHandler } from '../../services/play-x-sound-event-handler';
import { PlayerStateService } from '../../apps/Player/services/player-state-service';
import { DesktopManager } from '../../services/desktop-manager';
import { initWindowManager, cleanupWindowManager } from '../../services/window-manager';
import { NotificationDaemon } from '../../services/notification-daemon';
import { ToastContainer } from '../../components/ToastContainer/ToastContainer';
import { ApplicationHost } from '../../apps/ApplicationHost';
import { APPLICATION_IDS, getApplicationDefinition } from '../../apps/application-definitions';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { ApplicationServer } from '../../services/application-server';
import { DESKTOP_APP_IDS } from './desktop-layout';
import type { ApplicationId } from '../../apps/application-definitions';

const ICON_ORDER_STORAGE_KEY = 'desktop-icon-order';

function loadDesktopIconOrder(): ApplicationId[] {
  const defaultIds = DESKTOP_APP_IDS.filter((id) => APPLICATION_IDS.includes(id));
  const registryIds = defaultIds.filter((id) => !!getApplicationDefinition(id));

  try {
    const raw = localStorage.getItem(ICON_ORDER_STORAGE_KEY);
    if (!raw) return registryIds;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return registryIds;

    const seen = new Set<ApplicationId>();
    const validSavedOrder = parsed.filter((id): id is ApplicationId => {
      if (!APPLICATION_IDS.includes(id as ApplicationId)) return false;
      const typedId = id as ApplicationId;
      if (!registryIds.includes(typedId)) return false;
      if (seen.has(typedId)) return false;
      seen.add(typedId);
      return true;
    });

    return [...validSavedOrder, ...registryIds.filter((id) => !seen.has(id))];
  } catch {
    return registryIds;
  }
}

function saveDesktopIconOrder(order: ApplicationId[]) {
  try {
    localStorage.setItem(ICON_ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    // localStorage unavailable/full — ignore
  }
}

function Desktop() {
  const [desktopIconOrder, setDesktopIconOrder] = createSignal<ApplicationId[]>([]);
  const [draggedIconId, setDraggedIconId] = createSignal<ApplicationId | null>(null);

  onMount(() => {
    UserAccountService.checkLoginStateAndRedirect();
    SocketConnectionClient.connect();
    PlayXSoundEventHandler.initialize();
    PlayerStateService.initialize();
    NotificationDaemon.initialize();
    initWindowManager();
    setDesktopIconOrder(loadDesktopIconOrder());
  });

  onCleanup(() => {
    SocketConnectionClient.disconnect();
    PlayXSoundEventHandler.cleanup();
    PlayerStateService.cleanup();
    NotificationDaemon.cleanup();
    cleanupWindowManager();
  });

  const moveIcon = (targetId: ApplicationId) => {
    const sourceId = draggedIconId();
    if (!sourceId || sourceId === targetId) return;

    const currentOrder = desktopIconOrder();
    const from = currentOrder.indexOf(sourceId);
    const to = currentOrder.indexOf(targetId);
    if (from < 0 || to < 0) return;

    const nextOrder = [...currentOrder];
    nextOrder.splice(from, 1);
    nextOrder.splice(to, 0, sourceId);
    setDesktopIconOrder(nextOrder);
    saveDesktopIconOrder(nextOrder);
  };

  return (
    <>
      <MenuBar isUserLoggedIn={true} />
      <ToastContainer />
      <main
        class={styles.desktop}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) DesktopManager.clearAll();
        }}
      >
        <For each={desktopIconOrder()}>
          {(appId) => {
            const definition = getApplicationDefinition(appId);
            if (!definition) return null;

            return (
              <DesktopIcon
                label={definition.title}
                iconIndex={definition.iconIndex}
                selected={DesktopManager.selectedIconId() === appId}
                onClick={() => DesktopManager.selectIcon(appId)}
                onDoubleClick={() => ApplicationServer.open(appId)}
                draggable
                onDragStart={() => setDraggedIconId(appId)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => moveIcon(appId)}
                onDragEnd={() => setDraggedIconId(null)}
              />
            );
          }}
        </For>
        <ApplicationHost />
      </main>
    </>
  );
}

export { Desktop };
