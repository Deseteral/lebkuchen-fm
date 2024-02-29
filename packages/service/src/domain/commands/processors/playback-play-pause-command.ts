import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class PlayPauseCommand extends CommandProcessor {
  async execute(_: Command): Promise<CommandProcessingResponse> {
    return new CommandProcessingResponseBuilder()
      .fromMarkdown(this.helpMessage)
      .build();
  }

  get key(): string {
    return 'playback-play-pause';
  }

  get shortKey(): (string | null) {
    return 'play';
  }

  get helpMessage(): string {
    return '`@Deprecated` użyj bardziej precyzyjnych komend `resume`/`pause`';
  }

  get exampleUsages(): string[] {
    return [
      '',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder().buildEmpty();
  }
}

export { PlayPauseCommand };
