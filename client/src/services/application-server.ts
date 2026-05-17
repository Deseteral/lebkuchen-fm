import { createStore } from 'solid-js/store';
import { activateWindow } from './window-manager';

interface ApplicationLaunchOptions {
  startPosition?: { x: number; y: number };
  payload?: unknown;
}

interface ApplicationInstance {
  appId: string;
  isOpen: boolean;
  startPosition?: { x: number; y: number };
  payload?: unknown;
}

const [instances, setInstances] = createStore<Record<string, ApplicationInstance>>({});

function open(appId: string, options: ApplicationLaunchOptions = {}) {
  const isAlreadyOpen = instances[appId]?.isOpen === true;

  if (isAlreadyOpen) {
    activateWindow(appId);
    return;
  }

  setInstances(appId, {
    appId,
    isOpen: true,
    startPosition: options.startPosition,
    payload: options.payload,
  });
}

function close(appId: string) {
  if (!instances[appId]) return;
  setInstances(appId, {
    ...instances[appId],
    isOpen: false,
  });
}

function isOpen(appId: string): boolean {
  return instances[appId]?.isOpen === true;
}

function getInstance(appId: string): ApplicationInstance | undefined {
  return instances[appId];
}

function getOpenInstances(): ApplicationInstance[] {
  return Object.values(instances).filter((instance) => instance.isOpen);
}

const ApplicationServer = {
  open,
  close,
  isOpen,
  getInstance,
  getOpenInstances,
};

export { ApplicationServer };
export type { ApplicationInstance, ApplicationLaunchOptions };
