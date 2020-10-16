import PlayerState, { makeDefaultPlayerState } from '../domain/player-state/player-state';
import EventStream from './event-stream';
import { EventData, PlayerStateRequestEvent, PlayerStateUpdateEvent } from './model/events';

class PlayerEventStream {
  private eventStream: EventStream;

  private constructor() {
    this.eventStream = EventStream.instance;
  }

  private sendDefaultPlayerState(): void {
    const eventData: PlayerStateUpdateEvent = {
      id: 'PlayerStateUpdateEvent',
      state: makeDefaultPlayerState(),
    };
    this.sendToEveryone(eventData);
  }

  private requestAndSendPlayerState(): void {
    const reqEventData: PlayerStateRequestEvent = { id: 'PlayerStateRequestEvent' };
    const primaryClient = this.eventStream.getPrimaryPlayerSocket();

    primaryClient.emit('events', reqEventData, (primaryClientState: PlayerState) => {
      const updateEventData: PlayerStateUpdateEvent = {
        id: 'PlayerStateUpdateEvent',
        state: primaryClientState,
      };
      this.sendToEveryone(updateEventData);
    });
  }

  onUserConnected(): void {
    const connectedSocketCount = this.eventStream.getConnectedPlayerCount();

    if (connectedSocketCount <= 1) {
      this.sendDefaultPlayerState();
    } else {
      this.requestAndSendPlayerState();
    }
  }

  sendToEveryone(event: EventData): void {
    this.eventStream.playerBroadcast(event);
  }

  static readonly instance = new PlayerEventStream();
}

export default PlayerEventStream;
