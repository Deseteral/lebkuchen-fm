async function queueXSound(name: string) {
  console.log('queuing sound ', name);
  fetch('/commands/text', {
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
