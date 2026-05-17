import { createSignal } from 'solid-js';
import { Toggle } from '@components/Toggle/Toggle';
import { SliderInput } from '@components/SliderInput/SliderInput';
import { UserPreferencesService } from '../../../../services/user-preferences-service';
import styles from './SoundSettings.module.css';

function SoundSettings() {
  const [xSoundShouldPlay, setXSoundsShouldPlay] = createSignal(
    !!UserPreferencesService.get('xSoundShouldPlay'),
  );
  const [xSoundVolume, setXSoundVolume] = createSignal(
    UserPreferencesService.get<number>('xSoundVolume'),
  );

  const onXSoundsShouldPlayChange = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked;
    setXSoundsShouldPlay(checked);
    UserPreferencesService.set('xSoundShouldPlay', checked);
  };

  const onXSoundVolumeChange = (e: Event) => {
    const volume = Number((e.target as HTMLInputElement).value);
    setXSoundVolume(volume);
  };

  const saveNewXSoundVolume = (e: Event) => {
    const volume = Number((e.target as HTMLInputElement).value);
    UserPreferencesService.set('xSoundVolume', volume);
  };

  return (
    <section class={styles.section}>
      <h3 class={styles.sectionTitle}>Sound</h3>
      <Toggle onChange={onXSoundsShouldPlayChange} checked={xSoundShouldPlay()}>
        Play XSounds
      </Toggle>
      <SliderInput
        min={1}
        max={100}
        value={xSoundVolume()}
        onInput={onXSoundVolumeChange}
        onChange={saveNewXSoundVolume}
      >
        {`Volume: ${xSoundVolume()}%`}
      </SliderInput>
    </section>
  );
}

export { SoundSettings };
