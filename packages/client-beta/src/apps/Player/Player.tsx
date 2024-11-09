import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import circlePlayIcon from '../../icons/circle-play-regular.svg';
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
        imgSrc={circlePlayIcon}
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
      />
      {showWindow() && (
        <AppWindow title="LebkuchenFM Player" close={closeWindow}>
          <YouTubePlayer />
        </AppWindow>
      )}
    </>
  );
}

export { Player };
