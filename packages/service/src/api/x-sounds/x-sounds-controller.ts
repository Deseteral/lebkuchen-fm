import { Service } from 'typedi';
import { Controller, BodyParam, Post, Get, UploadedFile, ContentType, Authorized, CurrentUser, InternalServerError, QueryParam } from 'routing-controllers';
import { MissingRequriedFieldsError } from '@service/api/x-sounds/model/missing-required-fields-error';
import { XSound } from '@service/domain/x-sounds/x-sound';
import { XSoundsService } from '@service/domain/x-sounds/x-sounds-service';
import { Logger } from '@service/infrastructure/logger';
import { XSoundsResponseDto, XSoundsTagsResponseDto } from '@service/api/x-sounds/model/xsounds-response-dto';
import { User } from '@service/domain/users/user';

@Service()
@Controller('/api/x-sounds')
@Authorized()
class XSoundsController {
  private static logger = new Logger('x-sound-upload-controller');

  constructor(private xSoundsService: XSoundsService) { }

  @Get('/')
  @ContentType('application/json')
  async getXSounds(
    @QueryParam('tag') tag: string,
  ): Promise<XSoundsResponseDto> {
    const sounds = tag
      ? await this.xSoundsService.getAllByTag(tag)
      : await this.xSoundsService.getAll();

    return { sounds };
  }

  @Get('/tags')
  @ContentType('application/json')
  async getXSoundsAllTags(): Promise<XSoundsTagsResponseDto> {
    const tags = await this.xSoundsService.getAllUniqueTags();
    return { tags };
  }

  @Post('/')
  async addXSound(
    @UploadedFile('soundFile') soundFile: any,
    @BodyParam('soundName') soundName: string,
    @BodyParam('tags', { required: false }) tags: string,
    @CurrentUser() loggedInUser: User,
  ): Promise<XSound> {
    if (!soundFile || !soundName) {
      throw new MissingRequriedFieldsError();
    }

    const { buffer, originalname } = soundFile;
    const tagsList = tags ? tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [];

    XSoundsController.logger.info(`Uploading x-sound ${soundName}`);
    try {
      return this.xSoundsService.createNewSound(
        soundName,
        tagsList,
        { buffer, fileName: originalname },
        loggedInUser,
      );
    } catch (err) {
      const errorMessage = (err as Error).message;
      XSoundsController.logger.error(`An error occured ${errorMessage}`);
      throw new InternalServerError(errorMessage);
    }
  }
}

export { XSoundsController };
