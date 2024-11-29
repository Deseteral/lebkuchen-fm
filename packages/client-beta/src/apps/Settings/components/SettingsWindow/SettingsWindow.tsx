import { createSignal } from 'solid-js';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { Toggle } from '@components/Toggle/Toggle';
import styles from './SettingsWindow.module.css';
import { UserPreferencesService } from '../../../../services/user-preferences-service';

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
    <AppWindow title="Settings" close={props.close} startSize={{ width: '400px', height: '200px' }}>
      <section class={styles.section}>
        <h3 class={styles.sectionTitle}>X Sounds</h3>
        <Toggle onChange={onXSoundsPreferenceChange} checked={xSoundPreference()}>
          Play XSounds
        </Toggle>
        <label>
          <input
            type="range"
            min="1"
            max="100"
            value={xSoundVolume()}
            onInput={onXSoundVolumeChange}
            onChange={saveNewXSoundVolume}
          />
        </label>
        <span>Volume: {xSoundVolume()}%</span>
      </section>
    </AppWindow>
  );
}

export { SettingsWindow };
