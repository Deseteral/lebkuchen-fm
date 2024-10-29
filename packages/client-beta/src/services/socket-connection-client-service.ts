import { io, type Socket } from 'socket.io-client';
import { type LocalEventData, type LocalEvents } from '../types/local-events';
import { EventStreamClientService } from './event-stream-client-service';

type SendResponseCallback = (...args: unknown[]) => void;

class SocketConnectionClient {
  private static client: Socket | null = null;

  static initializeConnection(url: string = '/api/player'): void {
    if (!SocketConnectionClient.client) {
      SocketConnectionClient.client = io(url);
    }

    SocketConnectionClient.client
      .on('connect', () => console.log('Connected to event stream WebSocket'));

    SocketConnectionClient.client
      .on('message', (eventData: LocalEvents['eventData'], sendResponse: SendResponseCallback): void => {
        console.log('Received event from event stream', eventData);

        EventStreamClientService.broadcast(eventData.id, { eventData, sendResponse });
      });
  }

  static disconnect(): void {
    if (SocketConnectionClient.client) {
      SocketConnectionClient.client.disconnect();
      SocketConnectionClient.client = null;
    }
  }

  static sendSocketMessage<T extends LocalEventData>(messageId: T['id'], messageData: T): void {
    if (SocketConnectionClient.client) {
      SocketConnectionClient.client.emit(messageId, messageData);
    }
  }
}

export { SocketConnectionClient };
