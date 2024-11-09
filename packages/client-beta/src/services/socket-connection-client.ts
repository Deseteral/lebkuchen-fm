import { type LocalEventData, type LocalEvents } from '../types/local-events';
import { EventStreamClient } from './event-stream-client';

type SendResponseCallback = (...args: unknown[]) => void;

// TODO: Implement reconnecting logic when socket disconnects.
class SocketConnectionClient {
  private static client: WebSocket | null = null;

  static initializeConnection(): void {
    if (!SocketConnectionClient.client) {
      SocketConnectionClient.client = new WebSocket(SocketConnectionClient.getWebSocketUrl());
    }

    SocketConnectionClient.client.addEventListener('open', () =>
      console.log('Connected to event stream WebSocket'),
    );

    SocketConnectionClient.client.addEventListener(
      'message',
      (event): void => {
        console.log('Received event from event stream', event);

        const eventData = JSON.parse(event.data);
        console.log(eventData)
        // EventStreamClient.broadcast(eventData.id, { eventData, sendResponse });
      },
    );

    SocketConnectionClient.client.addEventListener('close', () => {
      SocketConnectionClient.client = null;
      console.log('Disconnected by server from WebSocket event stream');
    });
  }

  static disconnect(): void {
    if (!SocketConnectionClient.client) {
      console.warn('Could not disconnect WebSocket because it is not initialized.')
      return;
    }

    SocketConnectionClient.client.close();
    SocketConnectionClient.client = null;
    console.log('Disconnected from WebSocket event stream');
  }

  static sendSocketMessage<T extends LocalEventData>(messageId: T['id'], messageData: T): void {
    if (!SocketConnectionClient.client) {
      console.warn('Could not send WebSocket message because it is not initialized.')
      return;
    }

    SocketConnectionClient.client.send(JSON.stringify(messageData))
    console.log('Sent message to event stream', { messageId, messageData });
  }

  private static getWebSocketUrl(): string {
    let protocol = (window.location.protocol === "https:") ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/api/event-stream`;
  }
}

export { SocketConnectionClient };
