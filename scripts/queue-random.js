/*
 * This script should make it's way into standalone command like /fm random <amount> or something.
 * Until that it stays here. In it's pathetic form.
 */

const fetch = require('node-fetch');
const songList = require('./song-list');

if (!process.argv[2]) {
  console.log('queue-random <lebkuchen-fm service URL>');
  process.exit(1);
}

const serviceUrl = process.argv[2];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
  }
}

function queueById(songId) {
  console.log(songId);

  fetch(`${serviceUrl}/commands/hipchat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      item: {
        message: {
          message: `/fm q ${songId}`,
        },
      },
    }),
  });
}

(async () => {
  shuffleArray(songList);
  let cursor = 0;
  const DEJ = 10;

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const dej = () => {
    readline.question('Dej?', () => {
      songList.slice(cursor, (cursor + DEJ)).map(i => i.youtubeId).forEach(queueById);
      cursor += DEJ;

      dej();
    });
  };

  dej();
})();
