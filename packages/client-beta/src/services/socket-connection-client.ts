import { type LocalEventData, type LocalEvents } from '../types/local-events';
import { EventStreamClient } from './event-stream-client';

type SendResponseCallback = (...args: unknown[]) => void;

// TODO: Implement reconnecting logic when socket disconnects.
class SocketConnectionClient {
  private static client: WebSocket | null;

  static initializeConnection(): void {
    if (!SocketConnectionClient.client) {
      SocketConnectionClient.client = new WebSocket(SocketConnectionClient.webSocketUrl());
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
      console.log('Disconnected by server from WebSocket event stream');

      SocketConnectionClient.client = null;
    });
  }

  static disconnect(): void {
    if (SocketConnectionClient.client) {
      console.log('Disconnected from WebSocket event stream');

      // SocketConnectionClient.client.disconnect();
      SocketConnectionClient.client = null;
    }
  }

  static sendSocketMessage<T extends LocalEventData>(messageId: T['id'], messageData: T): void {
    console.log('Sending message to event stream', { messageId, messageData });
    if (SocketConnectionClient.client) {
      SocketConnectionClient.client.send(JSON.stringify(messageData))
    }
  }

  private static webSocketUrl() {
    let protocol = (window.location.protocol === "https:") ? 'wss:' : 'ws:';
    return "ws://localhost:8080/api/event-stream";
    return `${protocol}//${window.location.host}/api/event-stream`;
  }
}

export { SocketConnectionClient };
