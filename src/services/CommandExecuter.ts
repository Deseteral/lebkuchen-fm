import Command, { CommandType, AddArgument, QueueArgument, SayArgument } from '../domain/Command';
import Song from '../domain/Song';
import SongRepository from '../repositories/SongRepository';
import IoConnection from '../clients/IoConnection';
import { QueueActionType } from '../domain/io-messages/QueueMessage';

function handleAdd(argument: AddArgument) : string {
  const song: Song = {
    name: argument.name,
    youtubeId: argument.id,
    trimStartSeconds: argument.trimStartSeconds,
    trimEndSeconds: argument.trimEndSeconds,
    timesPlayed: 0,
  };

  SongRepository.insert(song);

  return `Dodałem utwór "${song.name}" do biblioteki`;
}

function handleQueue(argument: QueueArgument) : string {
  SongRepository.getByName(argument.id)
    .then(song =>
      IoConnection.broadcast('queue', { action: QueueActionType.Add, song }),
    )
    .catch(err => console.error(err));

  return '';
}

function handleSkip() : string {
  IoConnection.broadcast('queue', { action: QueueActionType.Skip, song: null });
  return '';
}

function handleSay(argument: SayArgument) : string {
  IoConnection.broadcast('say', { text: argument.text });
  return '';
}

function execute(command: Command) : string {
  switch (command.type) {
    case CommandType.Add:
      return handleAdd(command.arguments as AddArgument);
    case CommandType.Queue:
      return handleQueue(command.arguments as QueueArgument);
    case CommandType.Skip:
      return handleSkip();
    case CommandType.Say:
      return handleSay(command.arguments as SayArgument);
    default:
      return '';
  }
}

export default {
  execute,
};
