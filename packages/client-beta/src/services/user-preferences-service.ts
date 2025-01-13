type UserPreferenceValue = string | number | boolean;

// TODO: Enum with all possible user preferences
const DEFAULT_VALUES: Record<string, UserPreferenceValue> = {
  xSoundShouldPlay: true,
  xSoundVolume: 50,
};

class UserPreferencesService {
  static set(key: string, value: UserPreferenceValue) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Cannot set user preference "${key}"`, err);
    }
  }

  static get<T extends UserPreferenceValue>(key: string): T {
    const value = UserPreferencesService.safeGetFromLocalStorage(key);

    if (value === null) {
      const defaultValue = DEFAULT_VALUES[key];
      if (!defaultValue) {
        throw new Error(`Unknown user preference key "${key}".`);
      }

      UserPreferencesService.set(key, defaultValue);

      return defaultValue as T;
    }

    return JSON.parse(value) as T;
  }

  private static safeGetFromLocalStorage(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.error(`Cannot get user preference "${key}"`, err);
      return null;
    }
  }
}

export { UserPreferencesService };
