const AudioClient = new Audio();

async function queueXSound(name: string) {
  console.log('queuing sound ', name);
  fetch('/api/commands/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: `{"text": "/fm x ${name}"}`,
  });
}

function playXSoundLocally(url: string) {
  AudioClient.src = url;
  AudioClient.play();
}

export { queueXSound, playXSoundLocally };
