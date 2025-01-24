import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal } from 'solid-js';
import { SettingsWindow } from './components/SettingsWindow/SettingsWindow';
import { SETTINGS_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';

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
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
        iconIndex={SETTINGS_ICON_INDEX}
      />
      {showWindow() && <SettingsWindow close={closeWindow} />}
    </>
  );
}

export { Settings };
