export function getUserPreference<T>(key: string, defaultValue: T): (T | null) {
  try {
    const data = window.localStorage.getItem(key);
    return data ? JSON.parse(key) : defaultValue;
  } catch (e) {
    console.error(`Cannot get user preference "${key}"`);
    return defaultValue;
  }
}

export function setUserPreference<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Cannot set user preference "${key}"`);
  }
}
