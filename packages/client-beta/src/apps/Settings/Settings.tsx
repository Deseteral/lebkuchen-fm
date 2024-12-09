import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal } from 'solid-js';
import gearSolidIcon from '../../icons/gear-solid.svg';
import { SettingsWindow } from './components/SettingsWindow/SettingsWindow';

function Settings() {
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
        label="Settings"
        imgSrc={gearSolidIcon}
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
      />
      {showWindow() && <SettingsWindow close={closeWindow} />}
    </>
  );
}

export { Settings };
