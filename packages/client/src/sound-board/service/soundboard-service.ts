const audioClient = new Audio();

async function queueXSound(name: string) {
  fetch('/api/commands/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"text": "/fm x ${name}"}`,
  });
}

function playXSoundLocally(url: string) {
  audioClient.src = url;
  audioClient.play();
}

export { queueXSound, playXSoundLocally };
