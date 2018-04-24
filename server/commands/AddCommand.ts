import CommandDefinition from '../domain/CommandDefinition';
import Song from '../domain/Song';
import TrimTimeParser from '../helpers/TrimTimeParser';
import SongRepository from '../repositories/SongRepository';

function parseParameter(parameterComponent: string) : Song {
  const songDetails = parameterComponent
    .split('|')
    .map(s => s.trim());

  const youtubeId = songDetails[0];
  const name = songDetails[1];
  const trimStartSeconds = songDetails[2]
    ? TrimTimeParser.parseToSeconds(songDetails[2])
    : null;
  const trimEndSeconds = songDetails[3]
    ? TrimTimeParser.parseToSeconds(songDetails[3])
    : null;

  const song: Song = {
    name,
    youtubeId,
    trimStartSeconds,
    trimEndSeconds,
    timesPlayed: 0,
  };

  return song;
}

async function add(parameterComponent: string) : Promise<string> {
  const song = parseParameter(parameterComponent);
  const foundSong = await SongRepository.getByName(song.name);

  if (foundSong !== null) {
    return `Utwór o tytule "${song.name}" już jest w bazie`;
  }

  SongRepository.insert(song);
  return `Dodałem utwór "${song.name}" do biblioteki`;
}

const commandDefinition: CommandDefinition = {
  key: 'add',
  process: add,
  helpMessage: 'Dodaje przebój do bazy utworów',
};

export default commandDefinition;
