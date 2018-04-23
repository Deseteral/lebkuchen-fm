import CommandDefinition from '../domain/CommandDefinition';
import Song from '../domain/Song';
import SongRepository from '../repositories/SongRepository';

async function list(parameterComponent: string) : Promise<string> {
  const songs: Song[] = await SongRepository.getAll();

  if (songs.length === 0) {
    return 'Brak utworów w bazie';
  }

  const message = songs
    .map(song => `YT: ${song.youtubeId}, ${song.name}, ${song.timesPlayed} odtworzeń`)
    .join('\n');

  return message;
}

const commandDefinition: CommandDefinition = {
  key: 'list',
  process: list,
  helpMessage: 'Wypisuje listę utworów w bazie',
};

export default commandDefinition;
