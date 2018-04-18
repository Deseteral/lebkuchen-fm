import Command, { CommandType, AddArgument } from '../domain/Command';
import Song from '../domain/Song';
import SongRepository from '../repositories/SongRepository';

function handleAdd(argument: AddArgument) {
  const song: Song = {
    name: argument.name,
    youtubeId: argument.id,
    trimStartSeconds: argument.trimStartSeconds,
    trimEndSeconds: argument.trimEndSeconds,
    timesPlayed: 0,
  };

  SongRepository.insert(song);
}

function execute(command: Command) {
  switch (command.type) {
    case CommandType.Add:
      handleAdd(command.arguments as AddArgument);
      break;
    case CommandType.Queue:
      break;
    case CommandType.Skip:
      break;
  }
}

export default {
  execute,
};
