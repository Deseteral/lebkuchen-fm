class PlayerActions {
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
    PlayerActions.runCommand('/fm skip 1');
  }

  static playerPause() {
    PlayerActions.runCommand('/fm pause');
  }

  static playerResume() {
    PlayerActions.runCommand('/fm resume');
  }

  private static playRandomSongFromHistory(phrase?: string) {
    PlayerActions.runCommand(`/fm random ${phrase || ''}`);
  }

  private static playSongByYoutubeId(youtubeId: string) {
    PlayerActions.runCommand(`/fm q ${youtubeId}`);
  }

  private static playSongByPhrase(phrase: string) {
    PlayerActions.runCommand(`/fm s ${phrase}`);
  }

  private static runCommand(command: string) {
    fetch('/api/commands/execute', {
      method: 'POST',
      body: command,
    });
  }
}

export { PlayerActions };
