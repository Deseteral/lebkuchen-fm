import { Service } from 'typedi';
import { JsonController, Get } from 'routing-controllers';
import { SongsService } from '@service/domain/songs/songs-service';
import { SongsResponseDto } from '@service/api/songs/model/songs-response-dto';

@Service()
@JsonController('/songs')
class SongsController {
  constructor(private songsService: SongsService) { }

  @Get('/')
  async getSongs(): Promise<SongsResponseDto> {
    const songs = await this.songsService.getAll();
    return { songs };
  }
}

export { SongsController };
