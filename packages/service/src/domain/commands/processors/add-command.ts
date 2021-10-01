import Command from '../model/command';
import CommandDefinition from '../model/command-definition';
import CommandProcessingResponse, { makeSingleTextProcessingResponse } from '../model/command-processing-response';
import SongsService from '../../songs/songs-service';
import YouTubeDataClient from '../../../youtube/youtube-data-client';

function parseTimeStringToSeconds(text: string) : (number | undefined) {
  const [minutes, seconds] = text.split(':');

  if (!minutes || !seconds) {
    throw new Error('Niepoprawny format czasu');
  }

  const parsedMinutes = parseInt(minutes, 10);
  const parsedSeconds = parseInt(seconds, 10);

  if (Number.isNaN(parsedMinutes) || Number.isNaN(parsedSeconds)) {
    throw new Error('Niepoprawny format czasu');
  }

  return ((parsedMinutes * 60) + parsedSeconds);
}

async function addCommandProcessor(command: Command): Promise<CommandProcessingResponse> {
  const songDetails = command.getArgsByDelimiter('|');

  if (songDetails.length < 2) {
    throw new Error('Zbyt mała liczba argumentów');
  }

  const [youtubeId, name, trimStart, trimEnd] = songDetails;

  const foundSong = await SongsService.instance.getByName(name);
  if (foundSong !== null) {
    throw new Error(`Utwór o tytule "${name}" już jest w bazie`);
  }

  const videoStatus = await YouTubeDataClient.fetchVideosStatuses([youtubeId]);

  if (!videoStatus.items?.last().status.embeddable) {
    throw new Error('Ten plik nie jest obsługiwany przez osadzony odtwarzacz');
  }

  const trimStartSeconds = trimStart ? parseTimeStringToSeconds(trimStart) : undefined;
  const trimEndSeconds = trimEnd ? parseTimeStringToSeconds(trimEnd) : undefined;
  SongsService.instance.createNewSong(youtubeId, name, 0, trimStartSeconds, trimEndSeconds);

  return makeSingleTextProcessingResponse(`Dodano utwór "${name}" do biblioteki`, false);
}

const addCommandDefinition: CommandDefinition = {
  key: 'add',
  processor: addCommandProcessor,
  helpMessage: 'Dodaje przebój do bazy utworów',
  helpUsages: [
    '<youtube-id>|<video name>|[start time]|[end time]',
    'jK4ICUBdsuc|aldonka slowmo',
    'p28K7Fz0KrQ|transatlantik|0:00|1:53',
  ],
};

export default addCommandDefinition;
