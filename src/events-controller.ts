import express from 'express';
import WebSocket from 'ws';
import { EventData, processEventData } from './events-service';

function eventsController(ws: WebSocket, _: express.Request) {
  ws.on('message', (msg: string) => {
    const eventData = (JSON.parse(msg) as EventData);
    processEventData(eventData);
  });
  ws.on('close', () => console.log('close'));
}

export {
  eventsController,
};
