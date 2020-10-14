const path = require('path');
const { downloadFile, readJson } = require('./helpers');

if (!process.argv[2] && !process.argv[3]) {
  console.log('backup-xsounds <lebkuchen-fm service URL> <backup directory path>');
  process.exit(1);
}

const serviceUrl = process.argv[2];
const backupDirectoryPath = process.argv[3];

let soundCount = 0;
let progress = 0;

function mapSoundToFileInfo(sound) {
  return ({
    name: sound.name,
    url: sound.url,
    extension: path.extname(sound.url),
  });
}

function mapFileInfoToPromise({ name, url, extension }) {
  return new Promise((resolve) => {
    const filePath = path.resolve(backupDirectoryPath, `${name}${extension}`);
    downloadFile({ url, filePath })
      .then(() => {
        progress += 1;

        const counter = `[${progress.toString().padStart(`${soundCount}`.length, ' ')}/${soundCount}]`;
        console.log(`${counter} Saved "${name}"`);
        resolve();
      })
      .catch((err) => {
        console.error(`Failed to fetch ${name} (${url})`);
        console.error(err);
      });
  });
}

(async () => {
  const soundList = (await readJson(`${serviceUrl}/x-sounds`)).sounds;

  soundCount = soundList.length;

  Promise
    .allSettled(soundList.map(mapSoundToFileInfo).map(mapFileInfoToPromise))
    .then(() => console.log('Done!'))
    .catch(console.error);
})();
