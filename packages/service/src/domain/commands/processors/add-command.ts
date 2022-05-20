import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, makeSingleTextProcessingResponse } from '@service/domain/commands/model/command-processing-response';
import { CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { SongsService } from '@service/domain/songs/songs-service';
import { YouTubeDataClient } from '@service/youtube/youtube-data-client';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class AddCommand extends CommandProcessor {
  constructor(private songService: SongsService, private youTubeDataClient: YouTubeDataClient) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const songDetails = command.getArgsByDelimiter('|');

    if (songDetails.length < 2) {
      throw new Error('Zbyt mała liczba argumentów');
    }

    const [youtubeId, name, trimStart, trimEnd] = songDetails;

    const foundSong = await this.songService.getByName(name);
    if (foundSong !== null) {
      throw new Error(`Utwór o tytule "${name}" już jest w bazie`);
    }

    const videoStatus = await this.youTubeDataClient.fetchVideosStatuses([youtubeId]);

    if (!videoStatus.items?.last().status.embeddable) {
      throw new Error('Ten plik nie jest obsługiwany przez osadzony odtwarzacz');
    }

    const trimStartSeconds = trimStart ? this.parseTimeStringToSeconds(trimStart) : null;
    const trimEndSeconds = trimEnd ? this.parseTimeStringToSeconds(trimEnd) : null;
    this.songService.createNewSong(youtubeId, name, 0, trimStartSeconds, trimEndSeconds);

    return makeSingleTextProcessingResponse(`Dodano utwór "${name}" do biblioteki`);
  }

  private parseTimeStringToSeconds(text: string): number {
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

  get key(): string {
    return 'add';
  }

  get shortKey(): (string | null) {
    return null;
  }

  get helpMessage(): string {
    return 'Dodaje przebój do bazy utworów';
  }

  get helpUsages(): (string[] | null) {
    return [
      '<youtube-id>|<video name>|[start time]|[end time]',
      'jK4ICUBdsuc|aldonka slowmo',
      'p28K7Fz0KrQ|transatlantik|0:00|1:53',
    ];
  }
}

export { AddCommand };
