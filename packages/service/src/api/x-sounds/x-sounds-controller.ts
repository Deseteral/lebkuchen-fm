import { Service } from 'typedi';
import { Controller, BodyParam, Post, Get, UploadedFile, ContentType, Authorized } from 'routing-controllers';
import { MissingRequriedFieldsError } from '@service/api/x-sounds/model/missing-required-fields-error';
import { XSound } from '@service/domain/x-sounds/x-sound';
import { XSoundsService } from '@service/domain/x-sounds/x-sounds-service';
import { Logger } from '@service/infrastructure/logger';
import { InternalServerError } from '@service/api/internal-server-error';
import { XSoundsResponseDto } from '@service/api/x-sounds/model/xsounds-response-dto';

@Service()
@Controller('/x-sounds')
@Authorized()
class XSoundsController {
  private static logger = new Logger('x-sound-upload-controller');

  constructor(private xSoundsService: XSoundsService) { }

  @Get('/')
  @ContentType('application/json')
  async getXSounds(): Promise<XSoundsResponseDto> {
    const sounds = await this.xSoundsService.getAll();
    return { sounds };
  }

  @Post('/')
  async addXSound(@UploadedFile('soundFile') soundFile: any, @BodyParam('soundName') soundName: string): Promise<XSound> {
    if (!soundFile || !soundName) {
      throw new MissingRequriedFieldsError();
    }

    const { buffer, originalname } = soundFile;

    XSoundsController.logger.info(`Uploading x-sound ${soundName}`);

    try {
      const xSound = await this.xSoundsService.createNewSound(soundName, { buffer, fileName: originalname });
      return xSound;
    } catch (err) {
      const errorMessage = (err as Error).message;
      XSoundsController.logger.error(`An error occured ${errorMessage}`);
      throw new InternalServerError(err as Error);
    }
  }
}

export { XSoundsController };
