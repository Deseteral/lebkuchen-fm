import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalEventTypes } from '../types/local-events';

const mockBroadcast = vi.fn();
const mockRedirectTo = vi.fn();

vi.mock('./event-stream-client', () => ({
  EventStreamClient: {
    broadcast: mockBroadcast,
  },
}));

vi.mock('./redirect-to', () => ({
  redirectTo: mockRedirectTo,
}));

type EventHandler<TEvent extends Event = Event> = (event: TEvent) => void;

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  static instances: MockWebSocket[] = [];

  readyState = MockWebSocket.CONNECTING;
  sentPayloads: string[] = [];

  private listeners: {
    open: EventHandler[];
    message: EventHandler<MessageEvent<string>>[];
    close: EventHandler<CloseEvent>[];
    error: EventHandler[];
  } = {
    open: [],
    message: [],
    close: [],
    error: [],
  };

  constructor(public readonly url: string) {
    MockWebSocket.instances.push(this);
  }

  addEventListener(
    type: 'open' | 'message' | 'close' | 'error',
    listener: EventHandler,
    options?: AddEventListenerOptions,
  ) {
    const signal = options?.signal;
    const typedListener = listener as EventHandler;
    this.listeners[type].push(typedListener);

    if (signal) {
      signal.addEventListener(
        'abort',
        () => {
          this.listeners[type] = this.listeners[type].filter((cb) => cb !== typedListener) as never;
        },
        { once: true },
      );
    }
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
  }

  send(payload: string) {
    this.sentPayloads.push(payload);
  }

  dispatchOpen() {
    this.readyState = MockWebSocket.OPEN;
    for (const cb of this.listeners.open) cb(new Event('open'));
  }

  dispatchMessage(data: string) {
    const event = new MessageEvent('message', { data }) as MessageEvent<string>;
    for (const cb of this.listeners.message) cb(event);
  }

  dispatchClose(code = 1006) {
    this.readyState = MockWebSocket.CLOSED;
    const event = new CloseEvent('close', { code });
    for (const cb of this.listeners.close) cb(event);
  }

  dispatchError() {
    for (const cb of this.listeners.error) cb(new Event('error'));
  }
}

function latestSocket(): MockWebSocket {
  const socket = MockWebSocket.instances.at(-1);
  if (!socket) throw new Error('Expected WebSocket instance to exist.');
  return socket;
}

describe('SocketConnectionClient', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
    vi.clearAllMocks();
    MockWebSocket.instances = [];
    vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('creates exactly one socket while connecting/open', async () => {
    const { SocketConnectionClient } = await import('./socket-connection-client');

    SocketConnectionClient.connect();
    SocketConnectionClient.connect();

    expect(MockWebSocket.instances).toHaveLength(1);

    latestSocket().dispatchOpen();
    SocketConnectionClient.connect();

    expect(MockWebSocket.instances).toHaveLength(1);
  });

  it('broadcasts ready on open', async () => {
    const { SocketConnectionClient } = await import('./socket-connection-client');

    SocketConnectionClient.connect();
    latestSocket().dispatchOpen();

    expect(mockBroadcast).toHaveBeenCalledWith(LocalEventTypes.LocalWebSocketConnectionReady, {
      id: LocalEventTypes.LocalWebSocketConnectionReady,
    });
  });

  it('emits lost once, schedules reconnect, then emits restored on reopen', async () => {
    const { SocketConnectionClient } = await import('./socket-connection-client');

    SocketConnectionClient.connect();
    const socket = latestSocket();
    socket.dispatchOpen();

    socket.dispatchClose(1006);
    socket.dispatchClose(1006);

    const lostCalls = mockBroadcast.mock.calls.filter(
      (call) => call[0] === LocalEventTypes.LocalWebSocketConnectionLost,
    );
    expect(lostCalls).toHaveLength(1);

    vi.runOnlyPendingTimers();

    expect(MockWebSocket.instances).toHaveLength(2);

    latestSocket().dispatchOpen();

    expect(mockBroadcast).toHaveBeenCalledWith(LocalEventTypes.LocalWebSocketConnectionRestored, {
      id: LocalEventTypes.LocalWebSocketConnectionRestored,
    });
  });

  it('redirects to login and does not reconnect on session invalidation close', async () => {
    const { SocketConnectionClient } = await import('./socket-connection-client');

    SocketConnectionClient.connect();
    const socket = latestSocket();
    socket.dispatchOpen();

    socket.dispatchClose(4401);

    expect(mockRedirectTo).toHaveBeenCalledWith('/login');

    vi.runOnlyPendingTimers();
    expect(MockWebSocket.instances).toHaveLength(1);
  });

  it('does not reconnect after manual disconnect', async () => {
    const { SocketConnectionClient } = await import('./socket-connection-client');

    SocketConnectionClient.connect();
    const socket = latestSocket();
    socket.dispatchOpen();

    SocketConnectionClient.disconnect();
    socket.dispatchClose(1006);

    vi.runOnlyPendingTimers();
    expect(MockWebSocket.instances).toHaveLength(1);
  });

  it('drops send when socket is not open and sends when open', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const { SocketConnectionClient } = await import('./socket-connection-client');

    SocketConnectionClient.sendSocketMessage({ id: 'PlayerStateRequestEvent' } as never);
    expect(logSpy).toHaveBeenCalledWith(
      '[SocketConnectionClient] Could not send WebSocket message because connection is not open.',
      { readyState: null, messageId: 'PlayerStateRequestEvent' },
    );

    SocketConnectionClient.connect();
    const socket = latestSocket();
    socket.dispatchOpen();

    SocketConnectionClient.sendSocketMessage({ id: 'PlayerStateRequestEvent' } as never);

    expect(socket.sentPayloads).toContain(JSON.stringify({ id: 'PlayerStateRequestEvent' }));
  });

  it('broadcasts valid message events and skips invalid json', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { SocketConnectionClient } = await import('./socket-connection-client');

    SocketConnectionClient.connect();
    const socket = latestSocket();
    socket.dispatchOpen();

    socket.dispatchMessage(JSON.stringify({ id: 'PlayerStateUpdateEvent', state: {} }));
    expect(mockBroadcast.mock.calls).toContainEqual([
      'PlayerStateUpdateEvent',
      {
        id: 'PlayerStateUpdateEvent',
        state: {},
      },
    ]);

    const callsBeforeInvalid = mockBroadcast.mock.calls.length;
    socket.dispatchMessage('not-json');
    expect(mockBroadcast.mock.calls.length).toBe(callsBeforeInvalid);
    expect(errorSpy).toHaveBeenCalledWith(
      '[SocketConnectionClient] Could not parse WebSocket event stream message.',
      expect.anything(),
    );

    socket.dispatchMessage(JSON.stringify({ id: 'UnknownEvent', foo: 'bar' }));
    expect(mockBroadcast.mock.calls.length).toBe(callsBeforeInvalid);
    expect(warnSpy).toHaveBeenCalledWith(
      '[SocketConnectionClient] Dropped WebSocket event: unknown event id.',
      { id: 'UnknownEvent' },
    );

    socket.dispatchMessage(JSON.stringify({ id: 'PlayXSoundEvent', actorName: 'x' }));
    expect(mockBroadcast.mock.calls.length).toBe(callsBeforeInvalid);
    expect(warnSpy).toHaveBeenCalledWith(
      '[SocketConnectionClient] Dropped WebSocket event: invalid payload shape.',
      { id: 'PlayXSoundEvent' },
    );
  });
});
