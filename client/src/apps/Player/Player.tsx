import { DesktopApp } from '@components/DesktopApp/DesktopApp';
import { Show, createSignal } from 'solid-js';
import { PLAYER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { PlayerContent } from './components/PlayerContent/PlayerContent';
import { SongsQueue } from './components/SongsQueue/SongsQueue';
import { PlayerDaemon } from '../../services/player-daemon';

function Player() {
  const [windowRect, setWindowRect] = createSignal({ x: 100, y: 100, w: 600, h: 500 });
  const [showQueue, setShowQueue] = createSignal(false);

  return (
    <>
      <DesktopApp
        id="player"
        title="Player"
        iconIndex={PLAYER_ICON_INDEX}
        startSize={{ width: '600px', height: '500px', minWidth: '400px', minHeight: '157px' }}
        onRectChange={(x, y, w, h) => setWindowRect({ x, y, w, h })}
        onClose={() => setShowQueue(false)}
      >
        <PlayerContent onToggleQueue={() => setShowQueue((prev) => !prev)} />
      </DesktopApp>
      <Show when={showQueue()}>
        <SongsQueue
          queue={PlayerDaemon.songQueue()}
          startPosition={{
            x: windowRect().x + windowRect().w,
            y: windowRect().y,
          }}
          closeAction={() => setShowQueue(false)}
        />
      </Show>
    </>
  );
}

export { Player };
