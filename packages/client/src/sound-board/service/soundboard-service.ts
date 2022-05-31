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

export {
  queueXSound,
};
