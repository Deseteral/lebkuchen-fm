import SongService from "../services/SongService";

function songPlayed(youtubeId: string) {
  SongService.bumpPlayCount(youtubeId);
}

export default {
  songPlayed,
};
