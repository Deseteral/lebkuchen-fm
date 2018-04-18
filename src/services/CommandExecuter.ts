import Command, { CommandType, AddArgument, QueueArgument, SayArgument } from '../domain/Command';
import Song from '../domain/Song';
import SongRepository from '../repositories/SongRepository';
import IoConnection from '../clients/IoConnection';
import { QueueActionType, VideoWithId } from '../domain/io-messages/QueueMessage';

function handleAdd(argument: AddArgument) : Promise<string> {
  const song: Song = {
    name: argument.name,
    youtubeId: argument.id,
    trimStartSeconds: argument.trimStartSeconds,
    trimEndSeconds: argument.trimEndSeconds,
    timesPlayed: 0,
  };

  SongRepository.insert(song);

  return Promise.resolve(`Dodałem utwór "${song.name}" do biblioteki`);
}

function handleQueue(argument: QueueArgument) : Promise<string> {
  SongRepository.getByName(argument.id)
    .then((song) => {
      if (!song) {
        const videoWithId: VideoWithId = { youtubeId: argument.id };
        IoConnection.broadcast('queue', { action: QueueActionType.Add, song: videoWithId });
      } else {
        IoConnection.broadcast('queue', { action: QueueActionType.Add, song });
      }
    })
    .catch(err => console.error(err));

  return Promise.resolve('');
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

        console.log(message);
        resolve(message);
      })
      .catch(reject);
  });
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
    default:
      return Promise.resolve('');
  }
}

export default {
  execute,
};
