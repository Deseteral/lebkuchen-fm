import { AppWindow } from '@components/AppWindow/AppWindow';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createEffect, createSignal } from 'solid-js';
import { XSound } from '@service/domain/x-sounds/x-sound';
import styles from './Soundboard.module.css';

function Soundboard() {
  const [showWindow, setShowWindow] = createSignal(false);
  const [xsounds, setXsounds] = createSignal([]);
  let buttonRef!: HTMLButtonElement;
  const toggleWindow = () => {
    setShowWindow((prev: boolean) => !prev);
    if (buttonRef) {
      buttonRef.blur();
    }
  };

  createEffect(() => {
    fetch('/api/x-sounds')
      .then((res) => res.json())
      .then((res) => setXsounds(res.sounds));
  });

  return (
    <>
      <DesktopIcon
        label="Soundboard.exe"
        imgSrc="https://cdn2.iconfinder.com/data/icons/gadgets-and-devices/48/60-512.png"
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
      />
      {showWindow() && (
        <AppWindow title="LebkuchenFM Soundboard" close={() => setShowWindow(false)}>
          <h4>soundboard</h4>
          <div class={styles.container}>
            {xsounds() &&
              xsounds().map((xsound: XSound, idx: number) => (
                <button class={styles.button}>
                  {idx + 1}. {xsound.name}
                </button>
              ))}
          </div>
        </AppWindow>
      )}
    </>
  );
}

export { Soundboard };
