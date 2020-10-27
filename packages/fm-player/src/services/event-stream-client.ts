import io from 'socket.io-client';
import { EventData } from 'lebkuchen-fm-service';
import * as PlayerStateService from './player-state-service';
import * as SoundPlayerService from '../services/sound-player-service';
import * as SpeechService from '../services/speech-service';
import * as YouTubePlayerService from '../services/youtube-player-service';

function connect() {
  const client = io('/player');
  client.on('connect', () => console.log('Connected to event stream WebSocket'));

  client.on('events', (eventData: EventData, sendResponse: Function) => {
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

      case 'PauseEvent':
        YouTubePlayerService.pause();
        break;

      case 'ResumeEvent':
        YouTubePlayerService.resume();
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

      default:
        break;
    }
  });
}

export {
  connect,
};
