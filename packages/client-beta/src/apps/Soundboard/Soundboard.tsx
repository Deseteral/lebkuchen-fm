import { AppWindow } from '@components/AppWindow/AppWindow';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createEffect, createSignal } from 'solid-js';
import { XSound } from '@service/domain/x-sounds/x-sound';
import soundboardIcon from '../../icons/soundboard-icon.svg';
import styles from './Soundboard.module.css';

function Soundboard() {
  const [showWindow, setShowWindow] = createSignal(false);
  const [xsounds, setXsounds] = createSignal([]);
  const audioClient = new Audio();
  let buttonRef!: HTMLButtonElement;
  const toggleWindow = () => {
    setShowWindow((prev: boolean) => !prev);
    if (buttonRef) {
      buttonRef.blur();
    }
  };

  function playXSoundLocally(url: string) {
    audioClient.src = url;
    audioClient.play();
  }

  createEffect(() => {
    fetch('/api/x-sounds')
      .then((res) => res.json())
      .then((res) => setXsounds(res.sounds));
  });

  return (
    <>
      <DesktopIcon
        label='Soundboard.exe'
        imgSrc={soundboardIcon}
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
      />
      {showWindow() && (
        <AppWindow title='LebkuchenFM Soundboard' close={() => setShowWindow(false)}>
          <h4>soundboard</h4>
          <div class={styles.container}>
            {xsounds() &&
              xsounds().map((xsound: XSound) => (
                <button class={styles.button} onClick={() => playXSoundLocally(xsound.url)}>
                  {xsound.name}
                </button>
              ))}
          </div>
        </AppWindow>
      )}
    </>
  );
}

export { Soundboard };
