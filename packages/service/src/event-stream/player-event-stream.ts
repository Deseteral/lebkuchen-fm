import SocketIO from 'socket.io';
import PlayerState, { makeDefaultPlayerState } from '../domain/player-state/player-state';
import EventStream from './event-stream';
import { EventData, PlayerStateRequestEvent, PlayerStateUpdateEvent } from './model/events';

class PlayerEventStream {
  private eventStream: EventStream;

  private constructor() {
    this.eventStream = EventStream.instance;
  }

  onPlayerConnected(connectedPlayerSocket: SocketIO.Socket): void {
    const connectedSocketCount = this.eventStream.getConnectedPlayerCount();

    if (connectedSocketCount <= 1) {
      this.sendDefaultPlayerState(connectedPlayerSocket);
    } else {
      this.requestAndSendPlayerState(connectedPlayerSocket);
    }
  }

  sendToEveryone(event: EventData): void {
    this.eventStream.playerBroadcast(event);
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
    const primaryClient = this.eventStream.getPrimaryPlayerSocket();

    primaryClient?.send(reqEventData, (primaryClientState: PlayerState) => {
      const updateEventData: PlayerStateUpdateEvent = {
        id: 'PlayerStateUpdateEvent',
        state: primaryClientState,
      };
      receiver.send(updateEventData);
    });
  }

  static readonly instance = new PlayerEventStream();
}

export default PlayerEventStream;
