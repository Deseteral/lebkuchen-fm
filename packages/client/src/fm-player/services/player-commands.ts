function runCommand(command: string) {
  fetch('/api/commands/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"text": "${command}"}`,
  });
}

function skipSong() {
  runCommand('/fm skip 1');
}

function playRandomSongFromHistory(phrase?: string) {
  runCommand(`/fm random ${phrase || ''}`);
}

function playSongByPhrase(phrase: string) {
  runCommand(`/fm s ${phrase}`);
}

function playSongByYoutubeIdCommand(youtubeId: string) {
  runCommand(`/fm q ${youtubeId}`);
}

export {
  skipSong,
  playRandomSongFromHistory,
  playSongByPhrase,
  playSongByYoutubeIdCommand,
};
