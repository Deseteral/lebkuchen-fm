class SoundboardService {
  static async playXSound(soundName: string) {
    return fetch(`/api/soundboard/play?soundName=${soundName}`, { method: 'POST' });
  }
}
