import { DesktopApp } from '@components/DesktopApp/DesktopApp';
import { createSignal } from 'solid-js';
import { SETTINGS_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { Toggle } from '@components/Toggle/Toggle';
import { SliderInput } from '@components/SliderInput/SliderInput';
import { UserPreferencesService } from '../../services/user-preferences-service';
import styles from './components/SettingsWindow/SettingsWindow.module.css';

function Settings() {
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
    <DesktopApp
      id="settings"
      title="Settings"
      iconIndex={SETTINGS_ICON_INDEX}
      startSize={{ width: '400px', height: '240px' }}
    >
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
    </DesktopApp>
  );
}

export { Settings };
