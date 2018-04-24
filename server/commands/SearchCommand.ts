import nodeFetch from 'node-fetch';
import CommandDefinition from '../domain/CommandDefinition';
import Configuration from '../application/Configuration';
import Song from '../domain/Song';
import IoConnection from '../clients/IoConnection';
import QueueEventMessage from '../domain/event-messages/QueueEventMessage';

const YOUTUBE_API_KEY = Configuration.YOUTUBE_API_KEY;

function getUrlForPhrase(phrase: string) {
  const query = encodeURI(phrase);

  const url =
    'https://www.googleapis.com/youtube/v3/search?q=' +
    query +
    '&maxResults=1&part=snippet&key=' +
    YOUTUBE_API_KEY;

  return url;
}

async function fetchYouTubeData(phrase: string) {
  const url = getUrlForPhrase(phrase);
  const youtubeRequest = await nodeFetch(
    url,
    { headers: { 'Content-Type': 'application/json' } },
  );
  const data = await youtubeRequest.json();
  return data;
}

async function search(phrase: string) : Promise<string> {
  if (!YOUTUBE_API_KEY) {
    return 'Komenda search jest niedostępna bez klucza YouTube Data API :sadparrot:';
  }

  const data = await fetchYouTubeData(phrase);
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

  IoConnection.broadcast('queue', eventMessage);
  return `Dodano film "${title}" do kolejki`;
}

const commandDefinition: CommandDefinition = {
  key: 'search',
  process: search,
  helpMessage: 'Odtwarza pierwszy wynik wyszukiwania danej frazy na YouTube',
};

export default commandDefinition;
