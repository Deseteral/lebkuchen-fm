import { Service } from 'typedi';
import { JsonController, Body, Post } from 'routing-controllers';
import CommandExecutorService from '../../domain/commands/command-executor-service';
import { TextCommandResponseDto, mapCommandProcessingResponseToTextCommandResponseDto } from './model/text-command-response-dto';
import { TextCommandRequestDto } from './model/text-command-request-dto';
import Logger from '../../infrastructure/logger';

@Service()
@JsonController('/commands/text')
class TextCommandController {
  private static logger = new Logger('text-command-controller');

  constructor(private commandExecutorService: CommandExecutorService) { }

  @Post('/')
  async processTextCommand(@Body() body: TextCommandRequestDto): Promise<TextCommandResponseDto> {
    const { text } = body;
    TextCommandController.logger.info(`Received ${text} command`);

    const commandProcessingResponse = await this.commandExecutorService.processFromText(text);
    return mapCommandProcessingResponseToTextCommandResponseDto(commandProcessingResponse);
  }
}

export default TextCommandController;
