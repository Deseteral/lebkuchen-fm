import { Service } from 'typedi';
import { JsonController, Body, Post } from 'routing-controllers';
import { TextCommandRequestDto } from '@service/api/text/model/text-command-request-dto';
import { TextCommandResponseDto, mapCommandProcessingResponseToTextCommandResponseDto } from '@service/api/text/model/text-command-response-dto';
import { CommandExecutorService } from '@service/domain/commands/command-executor-service';
import { Logger } from '@service/infrastructure/logger';

@Service()
@JsonController('/commands/text')
class TextCommandController {
  private static logger = new Logger('text-command-controller');

  constructor(private commandExecutorService: CommandExecutorService) { }

  @Post('/')
  async processTextCommand(@Body() body: TextCommandRequestDto): Promise<TextCommandResponseDto> {
    return {
      textResponse: 'Słodziaczku nie zesraj się z tym cronem',
    };

    // const { text } = body;
    // TextCommandController.logger.info(`Received ${text} command`);

    // const commandProcessingResponse = await this.commandExecutorService.processFromText(text);
    // return mapCommandProcessingResponseToTextCommandResponseDto(commandProcessingResponse);
  }
}

export { TextCommandController };
