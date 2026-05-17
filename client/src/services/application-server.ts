import { createStore } from 'solid-js/store';
import { activateWindow } from './window-manager';
import type { IntegrationsResponse } from './integrations-service';
import type { ApplicationId } from '../apps/application-definitions';

interface ApplicationPayloadMap {
  player: undefined;
  soundboard: undefined;
  terminal: undefined;
  'sound-upload': undefined;
  users: undefined;
  'app-launcher': undefined;
  'control-panel': undefined;
  'sound-panel': undefined;
  'integrations-panel': IntegrationsResponse;
}

type WindowId = ApplicationId | 'users-new-user-dialog' | `users-properties-dialog:${string}`;

interface ApplicationLaunchOptions<AppId extends ApplicationId = ApplicationId> {
  startPosition?: { x: number; y: number };
  payload?: ApplicationPayloadMap[AppId];
}

interface ApplicationInstance<AppId extends ApplicationId = ApplicationId> {
  appId: AppId;
  isOpen: boolean;
  startPosition?: { x: number; y: number };
  payload?: ApplicationPayloadMap[AppId];
}

const [instances, setInstances] = createStore<Partial<Record<ApplicationId, ApplicationInstance>>>({});

function focus(windowId: WindowId): boolean {
  return activateWindow(windowId);
}

function open<AppId extends ApplicationId>(appId: AppId, options: ApplicationLaunchOptions<AppId> = {}) {
  const isAlreadyOpen = instances[appId]?.isOpen === true;

  if (isAlreadyOpen) {
    focus(appId);
    return;
  }

  setInstances(appId, {
    appId,
    isOpen: true,
    startPosition: options.startPosition,
    payload: options.payload,
  });
}

function openOrFocus<AppId extends ApplicationId>(
  appId: AppId,
  options: ApplicationLaunchOptions<AppId> = {},
) {
  open(appId, options);
}

function close(appId: ApplicationId) {
  if (!instances[appId]) return;
  setInstances(appId, {
    ...instances[appId],
    isOpen: false,
  });
}

function isOpen(appId: ApplicationId): boolean {
  return instances[appId]?.isOpen === true;
}

function getInstance<AppId extends ApplicationId>(appId: AppId): ApplicationInstance<AppId> | undefined {
  return instances[appId] as ApplicationInstance<AppId> | undefined;
}

function getOpenInstances(): ApplicationInstance[] {
  return Object.values(instances).filter(
    (instance): instance is ApplicationInstance => instance !== undefined && instance.isOpen,
  );
}

const ApplicationServer = {
  open,
  openOrFocus,
  focus,
  close,
  isOpen,
  getInstance,
  getOpenInstances,
};

export { ApplicationServer };
export type { ApplicationInstance, ApplicationLaunchOptions, ApplicationPayloadMap, WindowId };
