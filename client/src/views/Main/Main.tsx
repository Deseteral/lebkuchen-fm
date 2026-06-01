import { onCleanup, onMount } from 'solid-js';
import { UserAccountService } from '../../services/user-account-service';
import { MenuBar } from '@components/MenuBar/MenuBar';
import { SocketConnectionClient } from '../../services/socket-connection-client';
import { PlayXSoundEventHandler } from '../../services/play-x-sound-event-handler';
import { Desktop } from '@components/Desktop/Desktop';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { useWindowManager } from '@deseteral/biurko/adapters/solid-js';
import { ApplicationRegistry } from '../../apps/desktop-application';

export function Main() {
  onMount(() => {
    UserAccountService.checkLoginStateAndRedirect();
    SocketConnectionClient.connect();
    PlayXSoundEventHandler.initialize();
  });

  onCleanup(() => {
    SocketConnectionClient.disconnect();
    PlayXSoundEventHandler.cleanup();
  });

  return (
    <>
      <MenuBar isUserLoggedIn={true} />
      <Desktop>
        <DesktopApplicationList />
      </Desktop>
    </>
  );
}

function DesktopApplicationList() {
  const windowManager = useWindowManager();

  return (
    <>
      {ApplicationRegistry.map((app) => (
        <DesktopIcon
          label={app.name}
          onActivate={() => app.entryPoint(windowManager)}
          iconIndex={app.iconIndex}
        />
      ))}
    </>
  );
}
