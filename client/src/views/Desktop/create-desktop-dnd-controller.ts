import { createSignal } from 'solid-js';
import { APPLICATION_IDS } from '../../apps/application-definitions';
import { DesktopLayoutService } from '../../services/desktop-layout-service';
import { DesktopDragService } from '../../services/desktop-drag-service';
import type { ApplicationId } from '../../apps/application-definitions';

interface DesktopDndController {
  isTrashActive: () => boolean;
  draggedDesktopAppId: () => ApplicationId | null;
  registerGlobalHandlers: () => () => void;
  onDesktopDragOver: (e: DragEvent) => void;
  onDesktopDrop: (e: DragEvent) => void;
  onIconDragStart: (appId: ApplicationId, e: DragEvent) => void;
  onIconDragOver: (e: DragEvent) => void;
  onIconDrop: (targetId: ApplicationId, e: DragEvent) => void;
  onIconDragEnd: () => void;
  onTrashDragOver: (e: DragEvent) => void;
  onTrashDragLeave: () => void;
  onTrashDrop: (e: DragEvent) => void;
}

function createDesktopDndController(
  getDesktopElement: () => HTMLElement | undefined,
): DesktopDndController {
  const [isTrashActive, setIsTrashActive] = createSignal(false);

  const isPointInsideDesktop = (x: number, y: number) => {
    const desktop = getDesktopElement();
    if (!desktop) return false;
    const rect = desktop.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  const resolveDropPayload = (
    e: DragEvent,
  ): { appId: ApplicationId; source: 'desktop' | 'app-launcher' } | null => {
    const signalPayload = DesktopDragService.dragPayload();
    if (signalPayload) return signalPayload;

    const dataTransferPayload = DesktopDragService.readDataTransfer(e.dataTransfer);
    if (!dataTransferPayload) return null;
    if (!APPLICATION_IDS.includes(dataTransferPayload.appId)) return null;
    return dataTransferPayload;
  };

  const registerGlobalHandlers = () => {
    const handleGlobalDragOver = (e: DragEvent) => {
      const payload = resolveDropPayload(e);
      if (!payload || payload.source !== 'app-launcher') return;
      if (!isPointInsideDesktop(e.clientX, e.clientY)) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    };

    const handleGlobalDrop = (e: DragEvent) => {
      const payload = resolveDropPayload(e);
      if (!payload || payload.source !== 'app-launcher') return;
      if (!isPointInsideDesktop(e.clientX, e.clientY)) return;
      e.preventDefault();
      DesktopLayoutService.add(payload.appId);
      DesktopDragService.endDrag();
    };

    window.addEventListener('dragover', handleGlobalDragOver);
    window.addEventListener('drop', handleGlobalDrop);

    return () => {
      window.removeEventListener('dragover', handleGlobalDragOver);
      window.removeEventListener('drop', handleGlobalDrop);
    };
  };

  const onDesktopDragOver = (e: DragEvent) => {
    e.preventDefault();
    const payload = resolveDropPayload(e);
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = payload?.source === 'desktop' ? 'move' : 'copy';
    }
  };

  const onDesktopDrop = (e: DragEvent) => {
    const payload = resolveDropPayload(e);
    if (!payload) {
      DesktopDragService.endDrag();
      return;
    }

    if (payload.source === 'app-launcher') {
      DesktopLayoutService.add(payload.appId);
    }

    DesktopDragService.endDrag();
  };

  const onIconDragStart = (appId: ApplicationId, e: DragEvent) => {
    DesktopDragService.writeDataTransfer(e.dataTransfer, { appId, source: 'desktop' }, 'move');
    DesktopDragService.startDrag({ appId, source: 'desktop' });
  };

  const onIconDragOver = (e: DragEvent) => {
    e.preventDefault();
    const payload = resolveDropPayload(e);
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = payload?.source === 'desktop' ? 'move' : 'copy';
    }
  };

  const onIconDrop = (targetId: ApplicationId, e: DragEvent) => {
    e.preventDefault();
    const payload = resolveDropPayload(e);
    if (payload?.source === 'desktop') {
      DesktopLayoutService.reorder(payload.appId, targetId);
    } else if (payload?.source === 'app-launcher') {
      DesktopLayoutService.add(payload.appId);
    }
    DesktopDragService.endDrag();
  };

  const onIconDragEnd = () => {
    setTimeout(() => DesktopDragService.endDrag(), 0);
    setIsTrashActive(false);
  };

  const onTrashDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    setIsTrashActive(true);
  };

  const onTrashDragLeave = () => {
    setIsTrashActive(false);
  };

  const onTrashDrop = (e: DragEvent) => {
    const payload = resolveDropPayload(e);
    if (!payload || payload.source !== 'desktop') return;

    DesktopLayoutService.remove(payload.appId);
    DesktopDragService.endDrag();
    setIsTrashActive(false);
  };

  const draggedDesktopAppId = () => {
    const payload = DesktopDragService.dragPayload();
    if (!payload || payload.source !== 'desktop') return null;
    return payload.appId;
  };

  return {
    isTrashActive,
    draggedDesktopAppId,
    registerGlobalHandlers,
    onDesktopDragOver,
    onDesktopDrop,
    onIconDragStart,
    onIconDragOver,
    onIconDrop,
    onIconDragEnd,
    onTrashDragOver,
    onTrashDragLeave,
    onTrashDrop,
  };
}

export { createDesktopDndController };
