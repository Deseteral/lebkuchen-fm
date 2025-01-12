abstract class SoundboardService {
  static async playXSound(soundName: string) {
    return fetch(`/api/soundboard/play?soundName=${encodeURIComponent(soundName)}`, { method: 'POST' })
      .catch((err) => console.error(err));
  }
}

export { SoundboardService };
