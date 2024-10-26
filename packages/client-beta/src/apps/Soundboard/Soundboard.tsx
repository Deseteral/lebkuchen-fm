import { AppWindow } from '@components/AppWindow/AppWindow';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createEffect, createSignal, For } from 'solid-js';
import { XSound } from '@service/domain/x-sounds/x-sound';
import soundboardIcon from '../../icons/soundboard-icon.svg';
import styles from './Soundboard.module.css';
import {
  getXSounds,
  getXSoundsTags,
  soundMatchesPhrase,
  soundsSorting,
} from '../../services/soundboard-service';

function Soundboard() {
  const [showWindow, setShowWindow] = createSignal(false);
  const [filteredXSounds, setFilteredXSounds] = createSignal([]);
  const [xsounds, setXsounds] = createSignal([]);
  const [tags, setTags] = createSignal([]);
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
    getXSounds().then((sounds) => {
      setXsounds(sounds);
      setFilteredXSounds(sounds);
    });

    getXSoundsTags().then((tags) => {
      setTags(tags);
    });
  });

  const onSearchChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    const name = (e.target as HTMLInputElement).name;

    if (name === 'phrase') {
      (document.getElementsByName('tags')[0] as HTMLInputElement).value = '';
    } else if (name === 'tags') {
      (document.getElementsByName('phrase')[0] as HTMLInputElement).value = '';
    }

    setFilteredXSounds(
      xsounds()
        .filter((sound: XSound) => soundMatchesPhrase(sound, value))
        .sort(soundsSorting(value)),
    );
  };

  return (
    <>
      <DesktopIcon
        label="Soundboard.exe"
        imgSrc={soundboardIcon}
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
      />
      {showWindow() && (
        <AppWindow title="Soundboard" close={() => setShowWindow(false)}>
          <h4 class={styles.title}>Search</h4>
          <input
            class={styles.search}
            type="text"
            placeholder="phrase"
            name="phrase"
            onInput={onSearchChange}
          />
          <input
            list="tags"
            class={styles.search}
            type="text"
            placeholder="tags"
            name="tags"
            onInput={onSearchChange}
          />
          <datalist id="tags">
            <For each={tags()}>{(tag: string) => <option value={tag}>{tag}</option>}</For>
          </datalist>
          <h4 class={styles.title}>Sounds</h4>
          {filteredXSounds().length === 0 && <p class={styles.noResults}>No result</p>}
          <div class={styles.container}>
            {filteredXSounds() &&
              filteredXSounds().map((xsound: XSound) => (
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