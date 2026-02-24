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
    PlayerActions.runCommand('skip 1');
  }

  static playerPause() {
    PlayerActions.runCommand('pause');
  }

  static playerResume() {
    PlayerActions.runCommand('resume');
  }

  private static playRandomSongFromHistory(phrase?: string) {
    PlayerActions.runCommand(`random ${phrase || ''}`);
  }

  private static playSongByYoutubeId(youtubeId: string) {
    PlayerActions.runCommand(`q ${youtubeId}`);
  }

  private static playSongByPhrase(phrase: string) {
    PlayerActions.runCommand(`s ${phrase}`);
  }

  private static runCommand(command: string) {
    fetch('/api/commands/execute', {
      method: 'POST',
      body: command,
    });
  }
}

export { PlayerActions };
