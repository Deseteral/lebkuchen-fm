import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal } from 'solid-js';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { YouTubePlayer } from './components/YouTubePlayer/YouTubePlayer';
import { PLAYER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';

function Player() {
  const [showWindow, setShowWindow] = createSignal(false);
  let buttonRef!: HTMLButtonElement;
  const closeWindow = () => setShowWindow(false);
  const toggleWindow = () => {
    setShowWindow((prev: boolean) => !prev);
    if (buttonRef) {
      buttonRef.blur();
    }
  };

  return (
    <>
      <DesktopIcon
        label="Player"
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
        iconIndex={PLAYER_ICON_INDEX}
      />
      {showWindow() && (
        <AppWindow title="Player" close={closeWindow} iconIndex={PLAYER_ICON_INDEX}>
          <YouTubePlayer />
        </AppWindow>
      )}
    </>
  );
}

export { Player };
