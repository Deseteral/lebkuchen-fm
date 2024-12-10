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
  const [xSoundPreference, setXSoundPreference] = createSignal(
    !!UserPreferencesService.get('xSoundPreference'),
  );
  const [xSoundVolume, setXSoundVolume] = createSignal(
    (UserPreferencesService.get('xSoundVolume') ?? 50) as number,
  );

  const onXSoundsPreferenceChange = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked;
    setXSoundPreference(checked);
    UserPreferencesService.save('xSoundPreference', checked);
  };

  const onXSoundVolumeChange = (e: Event) => {
    const volume = Number((e.target as HTMLInputElement).value);
    setXSoundVolume(volume);
  };

  const saveNewXSoundVolume = (e: Event) => {
    const volume = Number((e.target as HTMLInputElement).value);
    UserPreferencesService.save('xSoundVolume', volume);
  };

  return (
    <AppWindow title="Settings" close={props.close} startSize={{ width: '400px', height: '200px' }} iconIndex={[3, 0]}>
      <section class={styles.section}>
        <h3 class={styles.sectionTitle}>X Sounds</h3>
        <Toggle onChange={onXSoundsPreferenceChange} checked={xSoundPreference()}>
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
