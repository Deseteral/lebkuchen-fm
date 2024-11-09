import { io, type Socket } from 'socket.io-client';
import { type LocalEventData, type LocalEvents } from '../types/local-events';
import { EventStreamClient } from './event-stream-client';

type SendResponseCallback = (...args: unknown[]) => void;

class SocketConnectionClient {
  private static client: Socket | null = null;

  static initializeConnection(url: string = '/api/player'): void {
    if (!SocketConnectionClient.client) {
      SocketConnectionClient.client = io(url);
    }

    SocketConnectionClient.client.on('connect', () =>
      console.log('Connected to event stream WebSocket'),
    );

    SocketConnectionClient.client.on(
      'message',
      (eventData: LocalEvents['eventData'], sendResponse: SendResponseCallback): void => {
        console.log('Received event from event stream', eventData);

        EventStreamClient.broadcast(eventData.id, { eventData, sendResponse });
      },
    );

    SocketConnectionClient.client.on('disconnect', (reason: Socket.DisconnectReason) => {
      console.log('Disconnected by server from WebSocket event stream', { reason });

      SocketConnectionClient.client = null;
    });
  }

  static disconnect(): void {
    if (SocketConnectionClient.client) {
      console.log('Disconnected from WebSocket event stream');

      SocketConnectionClient.client.disconnect();
      SocketConnectionClient.client = null;
    }
  }

  static sendSocketMessage<T extends LocalEventData>(messageId: T['id'], messageData: T): void {
    console.log('Sending message to event stream', { messageId, messageData });
    if (SocketConnectionClient.client) {
      SocketConnectionClient.client.emit(messageId, messageData);
    }
  }
}

export { SocketConnectionClient };
