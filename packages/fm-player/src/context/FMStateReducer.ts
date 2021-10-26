import { EventData, PlayerState } from 'lebkuchen-fm-service';
import Song from '@service/domain/songs/song';

function FMStateReducer(state: PlayerState, action: EventData): PlayerState {
  switch (action.id) {
    case 'AddSongsToQueueEvent':
    {
      const queue = [...state.queue, ...action.songs];
      const currentlyPlaying = state.currentlyPlaying === null && queue.length > 0
        ? {
          song: queue.pop() as Song,
          time: 0,
        }
        : state.currentlyPlaying;

      console.log(queue);

      return {
        ...state,
        queue,
        currentlyPlaying,
      };
    }
    case 'ChangeSpeedEvent':
      // TODO: later
      break;
    case 'ChangeVolumeEvent':
      return {
        ...state,
        volume: (action.isRelative ? state.volume : 0) + action.nextVolume,
      };
    case 'PauseEvent':
      return {
        ...state,
        isPlaying: false,
      };
    case 'PlayXSoundEvent':
      return {
        ...state,
        soundUrl: action.soundUrl,
      };
    case 'PlayerStateRequestEvent':
      // TODO: later
      break;
    case 'PlayerStateUpdateEvent':
      return {
        ...state,
        ...action.state,
      };
    case 'ResumeEvent':
      return {
        ...state,
        isPlaying: true,
      };
    case 'SayEvent':
      return {
        ...state,
        sayMessage: action.text,
      };
    case 'SkipEvent':
    {
      const queue = [...state.queue].splice(action.skipAll ? Infinity : action.amount - 1);
      const song = queue.pop();
      const currentlyPlaying = song ? { song, time: 0 } : null;
      return {
        ...state,
        queue,
        currentlyPlaying,
      };
    }
    default:
      throw new Error('unhandled action type');
  }

  return state;
}

export default FMStateReducer;
