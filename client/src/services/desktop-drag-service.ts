import { createSignal } from 'solid-js';
import { APPLICATION_IDS } from '../apps/application-definitions';
import type { ApplicationId } from '../apps/application-definitions';

type DragSource = 'desktop' | 'app-launcher';

interface DragPayload {
  appId: ApplicationId;
  source: DragSource;
}

const DRAG_MIME_TYPE = 'application/x-lebkuchen-desktop-drag';

const [dragPayload, setDragPayload] = createSignal<DragPayload | null>(null);

function startDrag(payload: DragPayload) {
  setDragPayload(payload);
}

function endDrag() {
  setDragPayload(null);
}

function writeDataTransfer(
  dataTransfer: DataTransfer | null,
  payload: DragPayload,
  effectAllowed: DataTransfer['effectAllowed'],
  dragImageSource?: HTMLElement,
) {
  if (!dataTransfer) return;

  dataTransfer.setData(DRAG_MIME_TYPE, JSON.stringify(payload));
  dataTransfer.setData('text/plain', payload.appId);
  dataTransfer.effectAllowed = effectAllowed;
  if (dragImageSource) {
    dataTransfer.setDragImage(dragImageSource, 24, 24);
  }
}

function readDataTransfer(dataTransfer: DataTransfer | null): DragPayload | null {
  if (!dataTransfer) return null;

  try {
    const raw = dataTransfer.getData(DRAG_MIME_TYPE);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { appId?: string; source?: DragSource };
    if (!parsed.appId || !parsed.source) return null;
    if (!APPLICATION_IDS.includes(parsed.appId as ApplicationId)) return null;

    return { appId: parsed.appId as ApplicationId, source: parsed.source };
  } catch {
    return null;
  }
}

const DesktopDragService = {
  dragPayload,
  startDrag,
  endDrag,
  writeDataTransfer,
  readDataTransfer,
};

export { DesktopDragService };
export type { DragSource, DragPayload };
