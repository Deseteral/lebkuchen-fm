const fs = require('fs');
const { extname } = require('path');
const fetch = require('node-fetch');

if (!process.argv[2]) throw new Error('Pass URL to lebkuchenfm service as first argument');

function mapSoundToFileInfo(sound) {
  return ({
    name: sound.name,
    url: sound.url,
    extension: extname(sound.url),
  });
}

function saveResponseToFile(response, fileInfo) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(`./sounds/${fileInfo.name}.${fileInfo.extension}`);

    response.body.pipe(fileStream);
    response.body.on('error', err => reject(err));
    fileStream.on('finish', () => resolve());
  });
}

function mapFileInfoToPromise(fileInfo) {
  return new Promise((resolve, reject) => {
    fetch(fileInfo.url)
      .then(response => saveResponseToFile(response, fileInfo))
      .then(resolve)
      .catch(reject);
  });
}

(async () => {
  const serviceUrl = process.argv[2];
  const soundList = (await (await fetch(`${serviceUrl}/xsounds`)).json());

  Promise.all(soundList.map(mapSoundToFileInfo).map(mapFileInfoToPromise));
})();
