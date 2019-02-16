const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

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

function saveResponseToFile(response, fileInfo) {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(backupDirectoryPath, `${fileInfo.name}${fileInfo.extension}`);
    const fileStream = fs.createWriteStream(filePath);

    response.body.pipe(fileStream);
    response.body.on('error', err => reject(err));
    fileStream.on('finish', () => resolve());
  });
}

function mapFileInfoToPromise(fileInfo) {
  return new Promise((resolve, reject) => {
    fetch(fileInfo.url)
      .then(response => saveResponseToFile(response, fileInfo))
      .then(() => {
        progress++;

        console.log(`Saved sound ${progress} of ${soundCount}`);
        resolve();
      })
      .catch((err) => {
        console.error(`Failed to fetch ${fileInfo.name} (${fileInfo.url})`);
        console.error(err);
        process.exit(1);
      });
  });
}

(async () => {
  const soundList = (await (await fetch(`${serviceUrl}/xsounds`)).json());

  soundCount = soundList.length;

  Promise
    .all(soundList.map(mapSoundToFileInfo).map(mapFileInfoToPromise))
    .then(() => console.log('Done!'));
})();
