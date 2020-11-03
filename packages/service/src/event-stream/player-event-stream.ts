import PlayerState, { makeDefaultPlayerState } from '../domain/player-state/player-state';
import EventStream from './event-stream';
import { EventData, PlayerStateRequestEvent, PlayerStateUpdateEvent } from './model/events';

class PlayerEventStream {
  private eventStream: EventStream;

  private constructor(eventStream: EventStream) {
    this.eventStream = eventStream;
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

    primaryClient.send(reqEventData, (primaryClientState: PlayerState) => {
      const updateEventData: PlayerStateUpdateEvent = {
        id: 'PlayerStateUpdateEvent',
        state: primaryClientState,
      };
      receiver.send(updateEventData);
    });
  }

  private static lazyInstance: PlayerEventStream | null = null;

  static get instance() : PlayerEventStream {
    if (PlayerEventStream.lazyInstance === null) {
      PlayerEventStream.lazyInstance = new PlayerEventStream(EventStream.instance);
    }
    return PlayerEventStream.lazyInstance;
  }
}

export default PlayerEventStream;
