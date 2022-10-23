import io from 'socket.io-client';
import { EventData } from 'lebkuchen-fm-service';
import * as PlayerStateService from './player-state-service';
import * as SoundPlayerService from './sound-player-service';
import * as SpeechService from './speech-service';
import * as YouTubePlayerService from './youtube-player-service';

function connect(): (() => void) {
  const client = io('/api/player');
  client.on('connect', () => console.log('Connected to event stream WebSocket'));

  client.on('message', (eventData: EventData, sendResponse: Function) => {
    console.log('Received event from event stream', eventData);

    switch (eventData.id) {
      case 'PlayerStateUpdateEvent':
        PlayerStateService.setState(eventData.state);
        break;

      case 'PlayerStateRequestEvent': {
        const state = PlayerStateService.getState();
        sendResponse(state);
      } break;

      case 'AddSongsToQueueEvent':
        PlayerStateService.addToQueue(eventData.songs);
        break;

      case 'PlayXSoundEvent':
        SoundPlayerService.playSound(eventData.soundUrl);
        break;

      case 'SayEvent':
        SpeechService.say(eventData.text);
        break;

      case 'PlayPauseEvent':
        YouTubePlayerService.playPause();
        break;

      case 'SkipEvent': {
        const amountToDrop = eventData.skipAll ? Infinity : (eventData.amount - 1);
        PlayerStateService.dropFromQueueFront(amountToDrop);
        YouTubePlayerService.playNextSong();
      } break;

      case 'ChangeSpeedEvent':
        YouTubePlayerService.setSpeed(eventData.nextSpeed);
        break;

      case 'ChangeVolumeEvent':
        PlayerStateService.changeVolume(eventData.nextVolume, eventData.isRelative);
        break;

      case 'ReplaceQueueEvent':
        PlayerStateService.replaceQueue(eventData.songs);
        break;

      case 'RewindToEvent':
        YouTubePlayerService.rewindTo(eventData.time);
        break;

      default:
        break;
    }
  });

  return function disconnect() {
    client.disconnect();
  };
}

export {
  connect,
};
