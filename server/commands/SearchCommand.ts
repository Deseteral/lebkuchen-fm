import CommandDefinition from '../domain/CommandDefinition';
import Song from '../domain/Song';
import IoConnection from '../clients/IoConnection';
import QueueEventMessage from '../domain/event-messages/QueueEventMessage';
import YouTubeDataClient from '../clients/YouTubeDataClient';
import Features from '../application/Features';
import SongService from '../services/SongService';

async function search(phrase: string) : Promise<string> {
  if (!Features.isYouTubeDataAvailable()) {
    return 'Komenda search jest niedostępna bez klucza YouTube Data API :sadparrot:';
  }

  const data = await YouTubeDataClient.getSearchResults(phrase);
  const videoId = data.items[0].id.videoId;
  const title = data.items[0].snippet.title;

  const song: Song = {
    name: title,
    youtubeId: videoId,
    trimStartSeconds: null,
    trimEndSeconds: null,
    timesPlayed: 0,
  };

  const eventMessage: QueueEventMessage = {
    song,
  };

  if (song.youtubeId !== 'kDw1G-l8T-g') {
    IoConnection.broadcast('queue', eventMessage);
    SongService.bumpPlayCount(song.youtubeId);
    return `Dodano film "${title}" do kolejki`;
  } else {
    return 'W tym pokoju nie mówi się, że się czegoś nie lubi bo zaraz będzie puszczone\nhttps://media.giphy.com/media/PAujV4AqViWCA/giphy.gif';
  }
}

const commandDefinition: CommandDefinition = {
  key: 'search',
  process: search,
  helpMessage: 'Odtwarza pierwszy wynik wyszukiwania danej frazy na YouTube',
};

export default commandDefinition;
