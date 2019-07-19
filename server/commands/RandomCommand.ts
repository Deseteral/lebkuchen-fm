import CommandDefinition from '../domain/CommandDefinition';
import Song from '../domain/Song';
import TrimTimeParser from '../helpers/TrimTimeParser';
import SongRepository from '../repositories/SongRepository';
import IoConnection from '../clients/IoConnection';
import QueueEventMessage from '../domain/event-messages/QueueEventMessage';
import SongService from '../services/SongService';

async function random() : Promise<string> {
  const songList = await SongRepository.getAll();
  const song = songList[Math.floor(Math.random() * songList.length)];

  const eventMessage: QueueEventMessage = { song };
  IoConnection.broadcast('queue', eventMessage);

  SongService.bumpPlayCount(song.youtubeId, song.name);

  return `Dodano "${song.name}" do kolejki`;
}

const commandDefinition: CommandDefinition = {
  key: 'random',
  process: random,
  helpMessage: 'Losuje utwór z historii',
};

export default commandDefinition;
