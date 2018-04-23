import SongService from '../services/SongService';
import Song from '../domain/Song';

function songPlayed(song: Song) {
  SongService.bumpPlayCount(song.youtubeId);
}

export default {
  songPlayed,
};
