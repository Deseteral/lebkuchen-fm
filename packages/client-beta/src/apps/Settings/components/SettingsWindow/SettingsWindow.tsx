import { createSignal } from 'solid-js';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { Toggle } from '@components/Toggle/Toggle';
import styles from './SettingsWindow.module.css';

interface SettingsWindowProps {
  close?: () => void;
}

const getXSoundPreference = () => {
  const value = localStorage.getItem('xSoundPreference');
  if (value === null) {
    saveXSoundPreference(true);
    return true;
  }

  return value === 'true';
};

const saveXSoundPreference = (value: boolean) => {
  localStorage.setItem('xSoundPreference', value.toString());
};

function SettingsWindow(props: SettingsWindowProps) {
  const [xSoundPreference, setXSoundPreference] = createSignal(getXSoundPreference());

  const onChange = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked;
    setXSoundPreference(checked);
    saveXSoundPreference(checked);
  };

  return (
    <AppWindow title="Settings" close={props.close} startSize={{ width: '400px', height: '200px' }}>
      <section class={styles.section}>
        <h3 class={styles.sectionTitle}>X Sounds</h3>
        <Toggle onChange={onChange} checked={xSoundPreference()}>
          Play XSounds
        </Toggle>
      </section>
    </AppWindow>
  );
}

export { SettingsWindow };
