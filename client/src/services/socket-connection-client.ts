import {
  type LocalEvent,
  LocalEventTypes,
  LocalWebSocketConnectionReadyEvent,
} from '../types/local-events';
import { EventStreamClient } from './event-stream-client';
import { redirectTo } from './redirect-to';

const SESSION_INVALIDATED_CLOSE_CODE = 4401;

class SocketConnectionClient {
  private static client: WebSocket | null = null;
  private static eventListenerAbortController: AbortController | null = null;

  private static readonly RECONNECT_INTERVAL_MS = 2000;

  static isReady(): boolean {
    return SocketConnectionClient.client?.readyState === WebSocket.OPEN;
  }

  static connect(): void {
    if (!SocketConnectionClient.client) {
      SocketConnectionClient.client = new WebSocket(SocketConnectionClient.getWebSocketUrl());
    }

    if (!SocketConnectionClient.eventListenerAbortController) {
      SocketConnectionClient.eventListenerAbortController = new AbortController();
    }

    SocketConnectionClient.client.addEventListener(
      'open',
      () => {
        console.log('[SocketConnectionClient] Connected to event stream WebSocket.');
        const id = LocalEventTypes.LocalWebSocketConnectionReady;
        const eventData: LocalWebSocketConnectionReadyEvent = { id };

        EventStreamClient.broadcast<LocalWebSocketConnectionReadyEvent>(id, eventData);
      },
      { signal: SocketConnectionClient.eventListenerAbortController.signal },
    );

    SocketConnectionClient.client.addEventListener(
      'message',
      (event: MessageEvent<string>): void => {
        const eventData = SocketConnectionClient.parseEventMessage(event.data);
        if (!eventData) {
          return;
        }

        console.log('[SocketConnectionClient] Received event from event stream.', eventData);
        EventStreamClient.broadcast(eventData.id, eventData);
      },
      { signal: SocketConnectionClient.eventListenerAbortController.signal },
    );

    SocketConnectionClient.client.addEventListener(
      'close',
      (event: CloseEvent) => {
        if (event.code === SESSION_INVALIDATED_CLOSE_CODE) {
          console.log('Session invalidated. Redirecting to login.');
          SocketConnectionClient.disconnect();
          redirectTo('/login');
          return;
        }

        console.log('[SocketConnectionClient] Disconnected by server from WebSocket event stream.');
        SocketConnectionClient.disconnect();
        SocketConnectionClient.startReconnectingProcedure();
      },
      { signal: SocketConnectionClient.eventListenerAbortController.signal },
    );

    SocketConnectionClient.client.addEventListener(
      'error',
      (err) => {
        console.error(
          '[SocketConnectionClient] Socket encountered error. Closing the socket.',
          err,
        );
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

    console.log('[SocketConnectionClient] Disconnected from WebSocket event stream.');
  }

  private static startReconnectingProcedure(): void {
    setTimeout(() => {
      console.log('[SocketConnectionClient] Reconnecting to event stream WebSocket...');
      SocketConnectionClient.connect();
    }, SocketConnectionClient.RECONNECT_INTERVAL_MS);
  }

  static sendSocketMessage<T extends LocalEvent>(messageData: T): void {
    if (!SocketConnectionClient.client) {
      // prettier-ignore
      console.log('[SocketConnectionClient] Could not send WebSocket message because it is not initialized.');
      return;
    }

    SocketConnectionClient.client.send(JSON.stringify(messageData));
    console.log('[SocketConnectionClient] Sent message to event stream.', messageData);
  }

  private static getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/api/event-stream`;
  }

  private static parseEventMessage(data: string): LocalEvent | null {
    try {
      return JSON.parse(data);
    } catch (err) {
      console.error(
        '[SocketConnectionClient] Could not parse WebSocket event stream message.',
        err,
      );
      return null;
    }
  }
}

export { SocketConnectionClient };
