import { Service } from 'typedi';
import { JsonController, Body, Post, Authorized, CurrentUser } from 'routing-controllers';
import { TextCommandRequestDto } from '@service/api/text/model/text-command-request-dto';
import { TextCommandResponseDto } from '@service/api/text/model/text-command-response-dto';
import { CommandExecutorService } from '@service/domain/commands/command-executor-service';
import { Logger } from '@service/infrastructure/logger';
import { ExecutionContext } from '@service/domain/commands/execution-context';
import { User } from '@service/domain/users/user';

@Service()
@JsonController('/api/commands/text')
@Authorized()
class TextCommandController {
  private static logger = new Logger('text-command-controller');

  constructor(private commandExecutorService: CommandExecutorService) { }

  @Post('/')
  async processTextCommand(@Body() body: TextCommandRequestDto, @CurrentUser() user: User): Promise<TextCommandResponseDto> {
    const { text } = body;
    TextCommandController.logger.info(`Received ${text} command from ${user.data.name}`);

    const context: ExecutionContext = {
      discordId: null,
      user,
    };

    const commandProcessingResponse = await this.commandExecutorService.processFromText(text, context);

    return {
      textResponse: commandProcessingResponse.message.markdown,
    };
  }
}

export { TextCommandController };
