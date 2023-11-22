import SocketIO from 'socket.io';
import { Inject, Service } from 'typedi';
import mitt, { Emitter } from 'mitt';
import {
  PlayerStateUpdateEvent,
  PlayerStateRequestEvent,
  EventData,
  ConnectedUsersEvent,
} from '@service/event-stream/model/events';
import { Logger } from '@service/infrastructure/logger';
import { PlayerState, makeDefaultPlayerState } from '@service/domain/player-state/player-state';
import { extractSessionFromIncomingMessage } from '@service/utils/utils';

@Service()
class PlayerEventStream {
  private static readonly logger = new Logger('player-event-stream');

  private emitter: Emitter;

  constructor(@Inject('io-player-namespace') private playerNamespace: SocketIO.Namespace) {
    this.emitter = mitt();
    this.playerNamespace.on('connection', (socket) => this.playerConnected(socket));
    this.emitter.on('playerConnectionChange', () => this.sendConnectedUsers());
  }

  public sendToEveryone(event: EventData): void {
    this.playerNamespace.send(event);
  }

  public sendToPrimaryPlayer<R>(reqEventData: EventData): Promise<R> {
    return new Promise((resolve, reject) => {
      try {
        this.getPrimaryPlayerSocket()?.send(reqEventData, (res: R) => resolve(res));
      } catch (e) {
        reject(e);
      }
    });
  }

  public getConnectedUsernames(): string[] {
    const socketToUsername = Array.from(this.playerNamespace.sockets, ([_key, value]) => value)
      .map((socket) => extractSessionFromIncomingMessage(socket.request))
      .map((session) => (session.loggedUser?.name || 'unexpected error'));

    return Array.from(new Set(socketToUsername));
  }

  public getConnectedPlayerSocketsCount(): number {
    return this.playerNamespace.sockets.size;
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
    const connectedSocketCount = this.getConnectedPlayerSocketsCount();

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

  private sendConnectedUsers(): void {
    const connectedUsers = this.getConnectedUsernames();
    const eventData: ConnectedUsersEvent = {
      id: 'ConnectedUsersEvent',
      connectedUsers,
    };
    this.sendToEveryone(eventData);
  }
}

export { PlayerEventStream };
