import { Component, Show, Suspense, lazy } from 'solid-js';
import { ApplicationServer } from '../services/application-server';
import type { ApplicationId } from './application-definitions';
import type { IntegrationsResponse } from '../services/integrations-service';

const Player = lazy(async () => ({ default: (await import('./Player/Player')).Player }));
const Soundboard = lazy(async () => ({
  default: (await import('./Soundboard/Soundboard')).Soundboard,
}));
const Terminal = lazy(async () => ({ default: (await import('./Terminal/Terminal')).Terminal }));
const SoundUpload = lazy(async () => ({
  default: (await import('./SoundUpload/SoundUpload')).SoundUpload,
}));
const Users = lazy(async () => ({ default: (await import('./Users/Users')).Users }));
const AppLauncher = lazy(async () => ({
  default: (await import('./AppLauncher/AppLauncher')).AppLauncher,
}));
const ControlPanelApp = lazy(async () => ({
  default: (await import('./ControlPanel/ControlPanelApp')).ControlPanelApp,
}));
const SoundSettingsApp = lazy(async () => ({
  default: (await import('./ControlPanel/SoundSettingsApp')).SoundSettingsApp,
}));
const IntegrationSettingsApp = lazy(async () => ({
  default: (await import('./ControlPanel/IntegrationSettingsApp')).IntegrationSettingsApp,
}));

interface AppMountProps {
  id: ApplicationId;
  component: Component;
}

function AppMount(props: AppMountProps) {
  return (
    <Show when={ApplicationServer.isOpen(props.id)}>
      <Suspense>
        <props.component />
      </Suspense>
    </Show>
  );
}

function IntegrationSettingsMount() {
  return (
    <Show when={ApplicationServer.isOpen('integration-settings')}>
      <Suspense>
        <IntegrationSettingsApp
          data={
            ApplicationServer.getInstance('integration-settings')?.payload as
              | IntegrationsResponse
              | undefined
          }
        />
      </Suspense>
    </Show>
  );
}

function ApplicationHost() {
  return (
    <>
      <AppMount id="player" component={Player} />
      <AppMount id="soundboard" component={Soundboard} />
      <AppMount id="terminal" component={Terminal} />
      <AppMount id="sound-upload" component={SoundUpload} />
      <AppMount id="users" component={Users} />
      <AppMount id="app-launcher" component={AppLauncher} />
      <AppMount id="control-panel" component={ControlPanelApp} />
      <AppMount id="sound-settings" component={SoundSettingsApp} />
      <IntegrationSettingsMount />
    </>
  );
}

export { ApplicationHost };
