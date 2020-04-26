import express from 'express';
import * as EventsService from './events-service';

function inspectController(_: express.Request, res: express.Response) {
  const html = `
    <html>
    <head>
      <title>LebkuchenFM service inspector</title>
      <meta charset="utf-8">
      <style>
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
      </style>
    </head>
    <body>
      <h1>LebkuchenFM service inspector</h1>
      <img src="https://web.archive.org/web/20090724131902im_/http://www.geocities.com/savagescorpio/music/BESTVIEWED.gif">
      <main>
        <section>
          <h2>WS connections</h2>
        </section>
      </main>
    </body>
    </html>
  `;
  res.send(html);
}

export {
  inspectController,
};
