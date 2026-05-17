import { createSignal } from 'solid-js';
import { apiFetch } from '../../../services/api-fetch';

const [commandError, setCommandError] = createSignal<string | null>(null);

class PlayerActions {
  static readonly commandError = commandError;

  static clearCommandError(): void {
    setCommandError(null);
  }

  static searchAndPlaySong(phrase: string) {
    if (phrase.startsWith('/q')) {
      PlayerActions.playSongByYoutubeId(phrase.replace('/q', '').trim());
    } else if (phrase.startsWith('/r')) {
      PlayerActions.playRandomSongFromHistory(phrase.replace('/r', '').trim());
    } else {
      PlayerActions.playSongByPhrase(phrase);
    }
  }

  static playRandomSong() {
    PlayerActions.playRandomSongFromHistory();
  }

  static skipSong() {
    PlayerActions.runCommand('playback-skip 1');
  }

  static playerPause() {
    PlayerActions.runCommand('playback-pause');
  }

  static playerResume() {
    PlayerActions.runCommand('playback-resume');
  }

  private static playRandomSongFromHistory(phrase?: string) {
    PlayerActions.runCommand(`song-random ${phrase || ''}`);
  }

  private static playSongByYoutubeId(youtubeId: string) {
    PlayerActions.runCommand(`song-queue ${youtubeId}`);
  }

  private static playSongByPhrase(phrase: string) {
    PlayerActions.runCommand(`song-search ${phrase}`);
  }

  private static async runCommand(command: string) {
    try {
      const response = await apiFetch('/api/commands/execute', {
        method: 'POST',
        body: command,
      });

      if (!response.ok) {
        const data = await response.json();
        setCommandError(data.textResponse ?? 'Command failed.');
      }
    } catch {
      setCommandError('An unexpected error occurred.');
    }
  }
}

export { PlayerActions };
