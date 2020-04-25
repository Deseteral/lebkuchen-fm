import express from 'express';
import WebSocket from 'ws';
import shortid from 'shortid';
import * as EventsService from './events-service';
import { EventData } from './events-service';

function eventsController(ws: WebSocket, _: express.Request) {
  const wsid = shortid.generate();

  EventsService.connectionOpened(wsid, ws);

  ws.on('message', (msg: string) => {
    const eventData = (JSON.parse(msg) as EventData);
    EventsService.processEventData(eventData, wsid);
  });
  ws.on('close', () => EventsService.connectionClosed(wsid));
}

export {
  eventsController,
};
