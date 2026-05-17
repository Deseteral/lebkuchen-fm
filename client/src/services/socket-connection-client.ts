import {
  type LocalEvent,
  LocalEventTypes,
  type LocalWebSocketConnectionLostEvent,
  LocalWebSocketConnectionReadyEvent,
  type LocalWebSocketConnectionRestoredEvent,
} from '../types/local-events';
import type { EventData } from '../types/event-data';
import { EventStreamClient } from './event-stream-client';
import { redirectTo } from './redirect-to';
import { isKnownEventId, isRecord, isString, isValidEventData } from './event-validation';

const SESSION_INVALIDATED_CLOSE_CODE = 4401;

class SocketConnectionClient {
  private static client: WebSocket | null = null;
  private static eventListenerAbortController: AbortController | null = null;
  private static reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private static reconnectAttempt = 0;
  private static manualDisconnect = false;
  private static hadUnexpectedDisconnect = false;

  private static readonly RECONNECT_BASE_INTERVAL_MS = 2000;
  private static readonly RECONNECT_MAX_INTERVAL_MS = 30000;
  private static readonly RECONNECT_JITTER_MIN = 0.8;
  private static readonly RECONNECT_JITTER_MAX = 1.2;

  static isReady(): boolean {
    return SocketConnectionClient.client?.readyState === WebSocket.OPEN;
  }

  static connect(): void {
    SocketConnectionClient.manualDisconnect = false;
    SocketConnectionClient.clearReconnectTimer();

    if (
      SocketConnectionClient.client?.readyState === WebSocket.OPEN ||
      SocketConnectionClient.client?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    SocketConnectionClient.client = new WebSocket(SocketConnectionClient.getWebSocketUrl());
    SocketConnectionClient.eventListenerAbortController = new AbortController();

    SocketConnectionClient.client.addEventListener(
      'open',
      () => {
        const wasReconnected = SocketConnectionClient.hadUnexpectedDisconnect;

        SocketConnectionClient.clearReconnectTimer();
        SocketConnectionClient.reconnectAttempt = 0;
        SocketConnectionClient.hadUnexpectedDisconnect = false;

        if (wasReconnected) {
          const restoredEvent: LocalWebSocketConnectionRestoredEvent = {
            id: LocalEventTypes.LocalWebSocketConnectionRestored,
          };
          EventStreamClient.broadcast<LocalWebSocketConnectionRestoredEvent>(
            restoredEvent.id,
            restoredEvent,
          );
        }

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
        const wasManualDisconnect = SocketConnectionClient.manualDisconnect;
        SocketConnectionClient.destroySocket(false);

        if (event.code === SESSION_INVALIDATED_CLOSE_CODE) {
          console.log('Session invalidated. Redirecting to login.');
          SocketConnectionClient.manualDisconnect = true;
          SocketConnectionClient.hadUnexpectedDisconnect = false;
          SocketConnectionClient.clearReconnectTimer();
          redirectTo('/login');
          return;
        }

        if (wasManualDisconnect) {
          return;
        }

        if (!SocketConnectionClient.hadUnexpectedDisconnect) {
          SocketConnectionClient.hadUnexpectedDisconnect = true;
          const lostEvent: LocalWebSocketConnectionLostEvent = {
            id: LocalEventTypes.LocalWebSocketConnectionLost,
          };
          EventStreamClient.broadcast<LocalWebSocketConnectionLostEvent>(lostEvent.id, lostEvent);
        }

        console.log('[SocketConnectionClient] Disconnected by server from WebSocket event stream.');
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
        SocketConnectionClient.client?.close();
      },
      { signal: SocketConnectionClient.eventListenerAbortController.signal },
    );
  }

  static disconnect(): void {
    SocketConnectionClient.manualDisconnect = true;
    SocketConnectionClient.hadUnexpectedDisconnect = false;
    SocketConnectionClient.clearReconnectTimer();
    SocketConnectionClient.destroySocket(true);
    SocketConnectionClient.reconnectAttempt = 0;

    console.log('[SocketConnectionClient] Disconnected from WebSocket event stream.');
  }

  private static destroySocket(closeClient: boolean): void {
    SocketConnectionClient.eventListenerAbortController?.abort();
    SocketConnectionClient.eventListenerAbortController = null;

    const client = SocketConnectionClient.client;
    SocketConnectionClient.client = null;

    if (
      closeClient &&
      client &&
      (client.readyState === WebSocket.CONNECTING || client.readyState === WebSocket.OPEN)
    ) {
      client.close();
    }
  }

  private static clearReconnectTimer(): void {
    if (SocketConnectionClient.reconnectTimer) {
      clearTimeout(SocketConnectionClient.reconnectTimer);
      SocketConnectionClient.reconnectTimer = null;
    }
  }

  private static startReconnectingProcedure(): void {
    if (SocketConnectionClient.manualDisconnect || SocketConnectionClient.reconnectTimer) {
      return;
    }

    const exponentialDelay = Math.min(
      SocketConnectionClient.RECONNECT_MAX_INTERVAL_MS,
      SocketConnectionClient.RECONNECT_BASE_INTERVAL_MS *
        2 ** Math.min(SocketConnectionClient.reconnectAttempt, 8),
    );
    const jitterRange =
      SocketConnectionClient.RECONNECT_JITTER_MAX - SocketConnectionClient.RECONNECT_JITTER_MIN;
    const jitter = SocketConnectionClient.RECONNECT_JITTER_MIN + Math.random() * jitterRange;
    const delay = Math.round(exponentialDelay * jitter);

    SocketConnectionClient.reconnectTimer = setTimeout(() => {
      SocketConnectionClient.reconnectTimer = null;

      if (SocketConnectionClient.manualDisconnect) {
        return;
      }

      console.log('[SocketConnectionClient] Reconnecting to event stream WebSocket...');
      SocketConnectionClient.reconnectAttempt += 1;
      SocketConnectionClient.connect();
    }, delay);
  }

  static sendSocketMessage<T extends LocalEvent>(messageData: T): void {
    const client = SocketConnectionClient.client;

    if (!client || !SocketConnectionClient.isReady()) {
      console.log(
        '[SocketConnectionClient] Could not send WebSocket message because connection is not open.',
        {
          readyState: client?.readyState ?? null,
          messageId: messageData.id,
        },
      );
      return;
    }

    client.send(JSON.stringify(messageData));
    console.log('[SocketConnectionClient] Sent message to event stream.', messageData);
  }

  private static getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/api/event-stream`;
  }

  private static parseEventMessage(data: string): EventData | null {
    const parsed = SocketConnectionClient.tryParseJson(data);
    if (!parsed) return null;

    if (!isRecord(parsed) || !isString(parsed.id)) {
      console.warn('[SocketConnectionClient] Dropped WebSocket event: invalid envelope.');
      return null;
    }

    if (!isKnownEventId(parsed.id)) {
      console.warn('[SocketConnectionClient] Dropped WebSocket event: unknown event id.', {
        id: parsed.id,
      });
      return null;
    }

    if (!isValidEventData(parsed)) {
      console.warn('[SocketConnectionClient] Dropped WebSocket event: invalid payload shape.', {
        id: parsed.id,
      });
      return null;
    }

    return parsed;
  }

  private static tryParseJson(data: string): unknown | null {
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
