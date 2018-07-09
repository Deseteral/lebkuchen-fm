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

async function queue(songName: string) : Promise<string> {
  const song: Song = await SongRepository.getByName(songName);
  const potentialYoutubeId = songName.split(' ')[0];
  const actualSong = song
    ? song
    : await createSongFromId(potentialYoutubeId);

  if (actualSong.youtubeId !== 'kDw1G-l8T-g') {
    const eventMessage: QueueEventMessage = { song: actualSong };
    IoConnection.broadcast('queue', eventMessage);

    SongService.bumpPlayCount(actualSong.youtubeId, actualSong.name);

    return `Dodano "${actualSong.name}" do kolejki`;
  } else {
    return 'W tym pokoju nie mówi się, że się czegoś nie lubi bo zaraz będzie puszczone\nhttps://media.giphy.com/media/PAujV4AqViWCA/giphy.gif';
  }
}

const commandDefinition: CommandDefinition = {
  key: 'queue',
  process: queue,
  helpMessage: 'Dodaje do kolejki utwór z bazy, a jeżeli go tam nie ma trakuje frazę jako YouTube ID', // tslint:disable
};

export default commandDefinition;
