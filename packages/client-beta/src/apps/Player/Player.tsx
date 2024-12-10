import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal } from 'solid-js';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { YouTubePlayer } from './components/YouTubePlayer/YouTubePlayer';

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
        iconIndex={[0, 0]}
      />
      {showWindow() && (
        <AppWindow title="Player" close={closeWindow} iconIndex={[0, 0]}>
          <YouTubePlayer />
        </AppWindow>
      )}
    </>
  );
}

export { Player };
