const KEY_PREFIX = 'window-rect:';

interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function saveWindowRect(appId: string, rect: WindowRect): void {
  try {
    localStorage.setItem(KEY_PREFIX + appId, JSON.stringify(rect));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

function loadWindowRect(appId: string): WindowRect | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + appId);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      typeof parsed.x === 'number' &&
      typeof parsed.y === 'number' &&
      typeof parsed.width === 'number' &&
      typeof parsed.height === 'number'
    ) {
      return parsed as WindowRect;
    }
    return null;
  } catch {
    return null;
  }
}

function clearWindowRect(appId: string): void {
  localStorage.removeItem(KEY_PREFIX + appId);
}

export { saveWindowRect, loadWindowRect, clearWindowRect };
export type { WindowRect };
