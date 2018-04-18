import Command, {
  CommandType,
  AddArgument,
  QueueArgument,
  SayArgument,
  XArgument,
  SearchArgument,
} from '../domain/Command';
import Song from '../domain/Song';
import SongRepository from '../repositories/SongRepository';
import IoConnection from '../clients/IoConnection';
import { QueueActionType, VideoWithId } from '../domain/io-messages/QueueMessage';
import XRepository from '../repositories/XRepository';
import XSound from '../domain/XSound';
import nodeFetch from 'node-fetch';

function handleAdd(argument: AddArgument) : Promise<string> {
  const song: Song = {
    name: argument.name,
    youtubeId: argument.id,
    trimStartSeconds: argument.trimStartSeconds,
    trimEndSeconds: argument.trimEndSeconds,
    timesPlayed: 0,
  };

  return SongRepository
    .getByName(song.name)
    .then((foundSong) => {
      if (foundSong !== null) {
        return Promise.resolve(`Utwór o tytule "${song.name}" już jest w bazie`);
      }

      SongRepository.insert(song);
      return Promise.resolve(`Dodałem utwór "${song.name}" do biblioteki`);
    });
}

function handleQueue(argument: QueueArgument) : Promise<string> {
  return SongRepository.getByName(argument.id)
    .then((song) => {
      if (!song) {
        const videoWithId: VideoWithId = { youtubeId: argument.id };
        IoConnection.broadcast('queue', { action: QueueActionType.Add, song: videoWithId });
        return Promise.resolve(`Dodano film o id ${videoWithId.youtubeId} do kolejki`);
      }

      IoConnection.broadcast('queue', { action: QueueActionType.Add, song });
      return Promise.resolve(`Dodano ${song.name} do kolejki`);
    });
}

function handleSearch(argument: SearchArgument) : Promise<string> {
  const encodedQuery = encodeURI(argument.query);
  const key = process.env['YOUTUBE_KEY'];
  const url = `https://www.googleapis.com/youtube/v3/search?q=${encodedQuery}&maxResults=1&part=snippet&key=${key}`;

  return nodeFetch(url, { headers: { 'Content-Type': 'application/json' } })
    .then(data => data.json())
    .then((data: any) => {
      console.log(data);
      const id = data.items[0].id.videoId;
      const title = data.items[0].snippet.title;
      const song: Song = {
        name,
        youtubeId: id,
        trimStartSeconds: null,
        trimEndSeconds: null,
        timesPlayed: 0,
      };
      IoConnection.broadcast('queue', { action: QueueActionType.Add, song });
      return Promise.resolve(`Dodano film "${title}" do kolejki`);
    });
}

function handleSkip() : Promise<string> {
  IoConnection.broadcast('queue', { action: QueueActionType.Skip, song: null });
  return Promise.resolve('');
}

function handleSay(argument: SayArgument) : Promise<string> {
  IoConnection.broadcast('say', { text: argument.text });
  return Promise.resolve('');
}

function handleList() : Promise<string> {
  return new Promise((resolve, reject) => {
    return SongRepository
      .getAll()
      .then((songs: Song[]) => {
        const message = songs
          .map(song => `YT: ${song.youtubeId}, ${song.name}, ${song.timesPlayed} odtworzeń`)
          .join('\n');

        resolve(message);
      })
      .catch(reject);
  });
}

function handleX(argument: XArgument) : Promise<string> {
  XRepository
    .getByName(argument.sound)
    .then((xsound: XSound) => {
      IoConnection.broadcast('x', { soundUrl: xsound.url });
    });

  return Promise.resolve('');
}

function execute(command: (Command | null)) : Promise<string> {
  if (!command) return Promise.resolve('');

  switch (command.type) {
    case CommandType.Add:
      return handleAdd(command.arguments as AddArgument);
    case CommandType.Queue:
      return handleQueue(command.arguments as QueueArgument);
    case CommandType.Skip:
      return handleSkip();
    case CommandType.Say:
      return handleSay(command.arguments as SayArgument);
    case CommandType.List:
      return handleList();
    case CommandType.X:
      return handleX(command.arguments as XArgument);
    case CommandType.Search:
      return handleSearch(command.arguments as SearchArgument);
    default:
      return Promise.resolve('');
  }
}

export default {
  execute,
};
