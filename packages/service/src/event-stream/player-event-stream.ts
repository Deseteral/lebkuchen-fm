import SocketIO from 'socket.io';
import { Inject, Service } from 'typedi';
import mitt, { Emitter } from 'mitt';
import { PlayerStateUpdateEvent, PlayerStateRequestEvent, EventData } from '@service/event-stream/model/events';
import { Logger } from '@service/infrastructure/logger';
import { PlayerState, makeDefaultPlayerState } from '@service/domain/player-state/player-state';

@Service()
class PlayerEventStream {
  private static readonly logger = new Logger('player-event-stream');

  private emitter: Emitter;

  constructor(@Inject('io-player-namespace') private playerNamespace: SocketIO.Namespace) {
    this.emitter = mitt();
    this.playerNamespace.on('connection', (socket) => this.playerConnected(socket));
  }

  public sendToEveryone(event: EventData): void {
    this.playerNamespace.send(event);
  }

  public getConnectedUsernames(): string[] {
    return Array.from(this.playerNamespace.sockets, ([_key, value]) => value)
      .map((socket) => socket.request.session)
      .map((session) => (session.loggedUser?.name || 'unexpected error'));
  }

  public getConnectedPlayerCount(): number {
    return this.getConnectedUsernames().length;
  }

  public onPlayerConnection(callback: () => void): void {
    this.emitter.on('playerConnectionChange', callback);
  }

  private getPrimaryPlayerSocket(): (SocketIO.Socket | null) {
    const primaryClientId = this.playerNamespace.sockets.keys().next().value;
    return this.playerNamespace.sockets.get(primaryClientId) || null;
  }

  private playerConnected(socket: SocketIO.Socket): void {
    PlayerEventStream.logger.info('New user connected to event stream on /player namespace');

    this.sendPlayerState(socket);
    this.emitter.emit('playerConnectionChange');

    socket.on('disconnect', () => {
      PlayerEventStream.logger.info('User disconnected from event stream on /player namespace');
      this.emitter.emit('playerConnectionChange');
    });
  }

  private sendPlayerState(connectedPlayerSocket: SocketIO.Socket): void {
    const connectedSocketCount = this.getConnectedPlayerCount();

    if (connectedSocketCount <= 1) {
      this.sendDefaultPlayerState(connectedPlayerSocket);
    } else {
      this.requestAndSendPlayerState(connectedPlayerSocket);
    }
  }

  private sendDefaultPlayerState(receiver: SocketIO.Socket): void { // eslint-disable-line class-methods-use-this
    const eventData: PlayerStateUpdateEvent = {
      id: 'PlayerStateUpdateEvent',
      state: makeDefaultPlayerState(),
    };
    receiver.send(eventData);
  }

  private requestAndSendPlayerState(receiver: SocketIO.Socket): void {
    const reqEventData: PlayerStateRequestEvent = { id: 'PlayerStateRequestEvent' };
    const primaryClient = this.getPrimaryPlayerSocket();

    primaryClient?.send(reqEventData, (primaryClientState: PlayerState) => {
      const updateEventData: PlayerStateUpdateEvent = {
        id: 'PlayerStateUpdateEvent',
        state: primaryClientState,
      };
      receiver.send(updateEventData);
    });
  }
}

export { PlayerEventStream };
