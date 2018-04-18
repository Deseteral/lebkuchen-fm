import BumpPlayCount from '../services/BumpPlayCount';

function songPlayed(youtubeId: string) {
  BumpPlayCount.bump(youtubeId);
}

export default {
  songPlayed,
};
