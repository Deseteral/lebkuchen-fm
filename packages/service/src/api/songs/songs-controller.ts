import { Service } from 'typedi';
import { JsonController, Get } from 'routing-controllers';
import SongsService from '@service/domain/songs/songs-service';
import Song from '@service/domain/songs/song';

@Service()
@JsonController('/songs')
class SongsController {
  constructor(private songsService: SongsService) { }

  @Get('/')
  async getSongs(): Promise<Song[]> {
    const songs = await this.songsService.getAll();
    return songs;
  }
}

export default SongsController;
