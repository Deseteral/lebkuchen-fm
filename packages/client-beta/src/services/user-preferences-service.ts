type UserPreferenceValue = string | number | boolean;

// TODO: Enum with all possible user preferences
const DEFAULT_VALUES: Record<string, UserPreferenceValue> = {
  xSoundPreference: true,
};

class UserPreferencesService {
  static save(key: string, value: UserPreferenceValue) {
    localStorage.setItem(key, value.toString());
  }

  static get(key: string): UserPreferenceValue | null {
    const value = localStorage.getItem(key);

    if (value === null && key in DEFAULT_VALUES) {
      const defaultValue = DEFAULT_VALUES[key];
      UserPreferencesService.save(key, defaultValue);
      return defaultValue;
    }

    return value;
  }
}

export { UserPreferencesService };
