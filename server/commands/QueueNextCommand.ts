import CommandDefinition from '../domain/CommandDefinition';
import IoConnection from '../clients/IoConnection';
import Song from '../domain/Song';
import SongRepository from '../repositories/SongRepository';
import QueueEventMessage from '../domain/event-messages/QueueEventMessage';
import FetchVideoTitle from '../helpers/FetchVideoTitle';
import SongService from '../services/SongService';

async function createSongFromId(youtubeId: string) : Promise<Song> {
  const name = await FetchVideoTitle.fetch(youtubeId);

  const song: Song = {
    name,
    youtubeId,
    trimStartSeconds: null,
    trimEndSeconds: null,
    timesPlayed: 0,
  };

  return song;
}

async function queueNext(songName: string) : Promise<string> {
  const song: Song = await SongRepository.getByName(songName);
  const potentialYoutubeId = songName.split(' ')[0];
  const actualSong = song
    ? song
    : await createSongFromId(potentialYoutubeId);

  actualSong.playNext = true;
  const eventMessage: QueueEventMessage = { song: actualSong, playNext: true };
  IoConnection.broadcast('queue', eventMessage);

  SongService.bumpPlayCount(actualSong.youtubeId, actualSong.name);

  return `Dodano "${actualSong.name}" na szczyt kolejki`;
}

const commandDefinition: CommandDefinition = {
  key: 'queue-next',
  shortKey: 'qn',
  process: queueNext,
  helpMessage: 'Dodaje na szczyt kolejki utwór z bazy, a jeżeli go tam nie ma trakuje frazę jako YouTube ID', // tslint:disable
};

export default commandDefinition;
