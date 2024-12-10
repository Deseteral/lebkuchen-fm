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

  static get(key: string): UserPreferenceValue | null {
    try {
      const value = localStorage.getItem(key);

      if (value === null && key in DEFAULT_VALUES) {
        const defaultValue = DEFAULT_VALUES[key];
        UserPreferencesService.set(key, defaultValue);

        return defaultValue;
      }

      return value ? JSON.parse(value) : null;
    } catch (err) {
      console.error(`Cannot get user preference "${key}"`, err);

      return null;
    }
  }
}

export { UserPreferencesService };
