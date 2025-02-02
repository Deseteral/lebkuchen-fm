import { type LocalEvent } from '../types/local-events';
import { EventStreamClient } from './event-stream-client';

class SocketConnectionClient {
  private static client: WebSocket | null = null;
  private static eventListenerAbortController: AbortController | null = null;

  private static readonly RECONNECT_INTERVAL_MS = 2000;

  static connect(): void {
    if (!SocketConnectionClient.client) {
      SocketConnectionClient.client = new WebSocket(SocketConnectionClient.getWebSocketUrl());
    }

    if (!SocketConnectionClient.eventListenerAbortController) {
      SocketConnectionClient.eventListenerAbortController = new AbortController();
    }

    SocketConnectionClient.client.addEventListener(
      'open',
      () => console.log('Connected to event stream WebSocket.'),
      { signal: SocketConnectionClient.eventListenerAbortController.signal },
    );

    SocketConnectionClient.client.addEventListener(
      'message',
      (event: MessageEvent<string>): void => {
        const eventData = SocketConnectionClient.parseEventMessage(event.data);
        if (!eventData) {
          return;
        }

        console.log('Received event from event stream.', eventData);
        EventStreamClient.broadcast(eventData.id, eventData);
      },
      { signal: SocketConnectionClient.eventListenerAbortController.signal },
    );

    SocketConnectionClient.client.addEventListener(
      'close',
      () => {
        console.log('Disconnected by server from WebSocket event stream.');
        SocketConnectionClient.disconnect();
        SocketConnectionClient.startReconnectingProcedure();
      },
      { signal: SocketConnectionClient.eventListenerAbortController.signal },
    );

    SocketConnectionClient.client.addEventListener(
      'error',
      (err) => {
        console.error('Socket encountered error. Closing the socket.', err);
        SocketConnectionClient.disconnect();
        SocketConnectionClient.startReconnectingProcedure();
      },
      { signal: SocketConnectionClient.eventListenerAbortController.signal },
    );
  }

  static disconnect(): void {
    SocketConnectionClient.eventListenerAbortController?.abort();
    SocketConnectionClient.eventListenerAbortController = null;

    SocketConnectionClient.client?.close();
    SocketConnectionClient.client = null;

    console.log('Disconnected from WebSocket event stream');
  }

  private static startReconnectingProcedure(): void {
    setTimeout(() => {
      console.log('Reconnecting to event stream WebSocket...');
      SocketConnectionClient.connect();
    }, SocketConnectionClient.RECONNECT_INTERVAL_MS);
  }

  static sendSocketMessage<T extends LocalEvent>(messageData: T): void {
    if (!SocketConnectionClient.client) {
      console.log('Could not send WebSocket message because it is not initialized.');
      return;
    }

    SocketConnectionClient.client.send(JSON.stringify(messageData));
    console.log('Sent message to event stream', messageData);
  }

  private static getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/api/event-stream`;
  }

  private static parseEventMessage(data: string): LocalEvent | null {
    try {
      return JSON.parse(data);
    } catch (err) {
      console.log('Could not parse WebSocket event stream message.', err);
      return null;
    }
  }
}

export { SocketConnectionClient };
