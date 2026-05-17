import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { Show, createSignal } from 'solid-js';
import { Dialog } from '@components/Dialog/Dialog';
import { PlayerContent } from './components/PlayerContent/PlayerContent';
import { SongsQueue } from './components/SongsQueue/SongsQueue';
import { PlayerActions } from './services/player-actions';
import { PlayerStateService } from './services/player-state-service';

function Player() {
  const [windowRect, setWindowRect] = createSignal({ x: 100, y: 100, w: 600, h: 500 });
  const [showQueue, setShowQueue] = createSignal(false);

  return (
    <>
      <ApplicationWindow
        id="player"
        startSize={{ width: '600px', height: '500px', minWidth: '400px', minHeight: '157px' }}
        onRectChange={(x, y, w, h) => setWindowRect({ x, y, w, h })}
        onClose={() => setShowQueue(false)}
      >
        <PlayerContent onToggleQueue={() => setShowQueue((prev) => !prev)} />
      </ApplicationWindow>
      <Show when={showQueue()}>
        <SongsQueue
          queue={PlayerStateService.songQueue()}
          startPosition={{
            x: windowRect().x + windowRect().w,
            y: windowRect().y,
          }}
          closeAction={() => setShowQueue(false)}
        />
      </Show>
      <Show when={PlayerActions.commandError()}>
        <Dialog
          variant="error"
          message={PlayerActions.commandError()!}
          close={PlayerActions.clearCommandError}
        />
      </Show>
    </>
  );
}

export { Player };
