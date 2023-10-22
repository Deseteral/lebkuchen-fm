function runCommand(command: string) {
  fetch('/api/commands/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"text": "${command}"}`,
  });
}

function runSkipCommand() {
  runCommand('/fm skip 1');
}

function runRandomCommand(phrase?: string) {
  runCommand(`/fm random ${phrase || ''}`);
}

function runSearchByPhraseCommand(phrase: string) {
  runCommand(`/fm s ${phrase}`);
}

function runSearchByYoutubeIdCommand(youtubeId: string) {
  runCommand(`/fm q ${youtubeId}`);
}

export {
  runSkipCommand,
  runRandomCommand,
  runSearchByPhraseCommand,
  runSearchByYoutubeIdCommand,
};
