function runCommand(command: string) {
  fetch('/api/commands/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"text": "${command}"}`,
  });
}

function playRandomSongFromHistory(phrase?: string) {
  runCommand(`/fmdev random ${phrase || ''}`);
}

function skipSong() {
  runCommand('/fmdev skip 1');
}

export {
  playRandomSongFromHistory,
  skipSong,
  runCommand,
}
