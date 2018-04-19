import SongRepository from '../repositories/SongRepository';
import Song from '../domain/Song';

function bump(youtubeId: string) {
  SongRepository
    .getByYoutubeId(youtubeId)
    .then((song) => {
      const updatedSong: Song = Object.assign({}, song);
      updatedSong.timesPlayed += 1;
      return Promise.resolve(updatedSong);
    })
    .then(SongRepository.update)
    .catch(err => console.error(err));
}

export default {
  bump,
};
