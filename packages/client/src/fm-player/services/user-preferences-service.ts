export function getUserPreference<T>(key: string, defaultValue: T): (T | null) {
  try {
    const data = window.localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    console.error(`Cannot get user preference "${key}"`, err);
    return defaultValue;
  }
}

export function setUserPreference<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Cannot set user preference "${key}"`, err);
  }
}
