import express from 'express';
import * as EventStream from './event-stream';
import * as Logger from './logger';

const router = express.Router();

router.get('/', async (_, res) => {
  const socketKeys = Object.keys(EventStream.getIo().sockets.sockets);
  const loggerLabels = Logger.get().levels.labels;
  const logs = (await Logger.getRawLogsFromFile())
    .map((log) => `${new Date(log.time).toLocaleString()} | ${loggerLabels[log.level]} | ${log.msg}`);

  const html = `
    <html>
    <head>
      <title>LebkuchenFM service inspector</title>
      <meta charset="utf-8">
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          background: #c0c0c0;
        }
        main {
          display: flex;
          flex-direction: column;
        }
        section {
          border: 2px solid;
          border-style: inset;
          padding: 8px;
          margin: 8px;
        }
        h1 {
          display: inline-block;
        }
        h2 {
          margin: 0;
          margin-top: -24px;
          background: #c0c0c0;
          display: inline-block;
          padding: 0 4px;
        }
        ul {
          margin: 0;
        }
        .textarea {
          margin: 8px;
          border: 2px solid;
          border-style: inset;
          background: white;
        }
      </style>
    </head>
    <body>
      <h1>LebkuchenFM service inspector</h1>
      <img src="https://web.archive.org/web/20090724131902im_/http://www.geocities.com/savagescorpio/music/BESTVIEWED.gif">
      <main>
        <section>
          <h2>WS connections</h2>
          <div>Current connections: ${socketKeys.length}</div>
          <ul>
            ${socketKeys.map((socketId) => (`<li><code>${socketId}</code></li>`)).join('')}
          </ul>
        </section>

        <section style="height: 450px; background: white;">${logs.map((s) => `<code>${s}</code>`).join('<br>')}</section>
      </main>
      <script>
        setInterval(async () => {
          const htmlTxt = (await (await fetch('/inspect')).text());
          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(htmlTxt, 'text/html');
          document.querySelector('main').innerHTML = htmlDoc.querySelector('main').innerHTML;
        }, 1000);
      </script>
    </body>
    </html>
  `;
  res.send(html);
});

export {
  router,
};
