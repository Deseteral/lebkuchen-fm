import { createSignal } from 'solid-js';
import { APPLICATION_IDS, getApplicationDefinition } from '../apps/application-definitions';
import { DESKTOP_APP_IDS } from '../views/Desktop/desktop-layout';
import type { ApplicationId } from '../apps/application-definitions';

const ICON_ORDER_STORAGE_KEY = 'desktop-icon-order';
const NON_REMOVABLE_APP_IDS: ApplicationId[] = ['app-launcher'];

const [iconOrder, setIconOrder] = createSignal<ApplicationId[]>([]);

function resolveRegistryDesktopDefaults(): ApplicationId[] {
  return DESKTOP_APP_IDS.filter((id) => APPLICATION_IDS.includes(id)).filter(
    (id) => !!getApplicationDefinition(id),
  );
}

function mergeSavedOrder(defaultIds: ApplicationId[], saved: unknown): ApplicationId[] {
  if (!Array.isArray(saved)) return defaultIds;

  const seen = new Set<ApplicationId>();
  const validSavedOrder = saved.filter((id): id is ApplicationId => {
    if (!APPLICATION_IDS.includes(id as ApplicationId)) return false;
    const typedId = id as ApplicationId;
    if (!defaultIds.includes(typedId)) return false;
    if (seen.has(typedId)) return false;
    seen.add(typedId);
    return true;
  });

  const merged = [...validSavedOrder, ...defaultIds.filter((id) => !seen.has(id))];
  for (const appId of NON_REMOVABLE_APP_IDS) {
    if (!merged.includes(appId) && defaultIds.includes(appId)) {
      merged.push(appId);
    }
  }

  return merged;
}

function save(order: ApplicationId[]) {
  try {
    localStorage.setItem(ICON_ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    // localStorage unavailable/full — ignore
  }
}

function load(): ApplicationId[] {
  const defaults = resolveRegistryDesktopDefaults();

  try {
    const raw = localStorage.getItem(ICON_ORDER_STORAGE_KEY);
    if (!raw) return defaults;
    return mergeSavedOrder(defaults, JSON.parse(raw));
  } catch {
    return defaults;
  }
}

function initialize() {
  setIconOrder(load());
}

function reorder(sourceId: ApplicationId, targetId: ApplicationId) {
  if (sourceId === targetId) return;

  const current = iconOrder();
  const from = current.indexOf(sourceId);
  const to = current.indexOf(targetId);
  if (from < 0 || to < 0) return;

  const next = [...current];
  next.splice(from, 1);
  next.splice(to, 0, sourceId);
  setIconOrder(next);
  save(next);
}

function add(appId: ApplicationId) {
  if (!APPLICATION_IDS.includes(appId)) return;
  if (!getApplicationDefinition(appId)) return;

  const current = iconOrder();
  if (current.includes(appId)) return;

  const next = [...current, appId];
  setIconOrder(next);
  save(next);
}

function remove(appId: ApplicationId) {
  if (NON_REMOVABLE_APP_IDS.includes(appId)) return;
  const current = iconOrder();
  if (!current.includes(appId)) return;

  const next = current.filter((id) => id !== appId);
  setIconOrder(next);
  save(next);
}

const DesktopLayoutService = {
  iconOrder,
  initialize,
  reorder,
  add,
  remove,
};

export { DesktopLayoutService };
