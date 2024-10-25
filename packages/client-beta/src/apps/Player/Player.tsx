import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import circlePlayIcon from '../../icons/circle-play-regular.svg';
import { createSignal } from 'solid-js';
import { AppWindow } from '@components/AppWindow/AppWindow';

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

  console.log(buttonRef);
  return (
    <>
      <DesktopIcon
        label="Player.exe"
        imgSrc={circlePlayIcon}
        buttonRef={(el: HTMLButtonElement) => buttonRef = el}
        toggleWindow={toggleWindow}
      />
      {showWindow() && (
        <AppWindow title="Plejer" close={closeWindow}>
          <div>
            <h1>Player</h1>
          </div>
        </AppWindow>
      )}
    </>
  )
}

export { Player };
