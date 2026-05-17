import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { createEffect, createMemo, createSignal, For, onMount } from 'solid-js';
import styles from './Soundboard.module.css';
import { XSound } from '../../types/x-sound';
import { SoundboardService } from './services/soundboard-service';
import { playAudioFromUrl } from '../../services/audio-service';
import { UserPreferencesService } from '../../services/user-preferences-service';

const SEARCH_DEBOUNCE_MS = 80;

function Soundboard() {
  const [xsounds, setXsounds] = createSignal<XSound[]>([]);
  const [tags, setTags] = createSignal<string[]>([]);
  const [phraseQuery, setPhraseQuery] = createSignal('');
  const [tagQuery, setTagQuery] = createSignal('');
  const [debouncedQuery, setDebouncedQuery] = createSignal('');

  const activeQuery = createMemo(() => {
    const tag = tagQuery().trim();
    if (tag.length > 0) return tag;
    return phraseQuery().trim();
  });

  createEffect(() => {
    const query = activeQuery();
    const timer = setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  });

  const filteredXSounds = createMemo(() => {
    const query = debouncedQuery();
    return xsounds()
      .filter((sound: XSound) => SoundboardService.soundMatchesPhrase(sound, query))
      .sort(SoundboardService.soundsComparator(query));
  });

  function playXSound(sound: XSound, event: MouseEvent) {
    if (event.metaKey || event.altKey) {
      const volume = UserPreferencesService.get<number>('xSoundVolume');
      playAudioFromUrl(sound.url, volume);
    } else {
      SoundboardService.playXSound(sound.name);
    }
  }

  onMount(() => {
    SoundboardService.getXSounds().then((sounds) => {
      setXsounds(sounds);
    });

    SoundboardService.getXSoundsTags().then((tags) => {
      setTags(tags);
    });
  });

  const onPhraseInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setPhraseQuery(value);
    if (tagQuery() !== '') setTagQuery('');
  };

  const onTagInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setTagQuery(value);
    if (phraseQuery() !== '') setPhraseQuery('');
  };

  return (
    <ApplicationWindow id="soundboard" startSize={{ width: '600px', height: '600px' }}>
      <h4 class={styles.title}>Search</h4>
      <input
        class={styles.search}
        type="text"
        placeholder="phrase"
        name="phrase"
        value={phraseQuery()}
        onInput={onPhraseInput}
      />
      <input
        list="tags"
        class={styles.search}
        type="text"
        placeholder="tags"
        name="tags"
        value={tagQuery()}
        onInput={onTagInput}
      />
      <datalist id="tags">
        <For each={tags()}>{(tag: string) => <option value={tag}>{tag}</option>}</For>
      </datalist>
      <h4 class={styles.title}>Sounds</h4>
      {filteredXSounds().length === 0 && <p class={styles.noResults}>No result</p>}
      <div class={styles.container}>
        <For each={filteredXSounds()}>
          {(xsound: XSound) => (
            <button class={styles.button} onClick={(event) => playXSound(xsound, event)}>
              {xsound.name}
            </button>
          )}
        </For>
      </div>
    </ApplicationWindow>
  );
}

export { Soundboard };
