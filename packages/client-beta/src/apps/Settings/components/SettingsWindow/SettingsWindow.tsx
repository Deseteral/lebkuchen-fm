import { createSignal } from 'solid-js';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { Toggle } from '@components/Toggle/Toggle';
import styles from './SettingsWindow.module.css';
import { UserPreferencesService } from '../../../../services/user-preferences-service';
import { SliderInput } from '@components/SliderInput/SliderInput';

interface SettingsWindowProps {
  close?: () => void;
}

function SettingsWindow(props: SettingsWindowProps) {
  const [xSoundShouldPlay, setXSoundsShouldPlay] = createSignal(
    !!UserPreferencesService.get('xSoundShouldPlay'),
  );
  const [xSoundVolume, setXSoundVolume] = createSignal(
    (UserPreferencesService.get('xSoundVolume') ?? 50) as number,
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
    <AppWindow title="Settings" close={props.close} startSize={{ width: '400px', height: '200px' }}>
      <section class={styles.section}>
        <h3 class={styles.sectionTitle}>X Sounds</h3>
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
    </AppWindow>
  );
}

export { SettingsWindow };
