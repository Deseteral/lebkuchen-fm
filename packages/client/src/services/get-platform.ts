export function getPlatform(): string | null {
  if (/Windows/.test(navigator.userAgent)) {
    return 'windows';
  }
  if (/Macintosh/.test(navigator.userAgent)) {
    return 'mac';
  }
  return null;
}
