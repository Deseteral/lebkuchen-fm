const fs = require('fs');
const http = require('http');
const https = require('https');

// TODO: Use node-fetch instead

function downloadFile({ url, filePath }) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Downloading ${url} failed. Status code: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(filePath);
      response.pipe(file);
      resolve();
    });
  });
}

function readJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(body));
      });
    }).on('error', reject);
  });
}

module.exports = {
  downloadFile,
  readJson,
};
