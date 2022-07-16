import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { SkipEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class PlaybackSkipCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const skipAll = command.rawArgs === 'all';
    const amount = (!command.rawArgs)
      ? 1
      : parseInt(command.rawArgs, 10);

    if ((Number.isNaN(amount) || amount < 1) && !skipAll) {
      throw new Error('Skip akceptuje liczby naturalne lub argument "all"');
    }

    const event: SkipEvent = { id: 'SkipEvent', skipAll, amount: amount || 1 };
    this.playerEventStream.sendToEveryone(event);

    return new CommandProcessingResponseBuilder()
      .fromMarkdown('Lecimy dalej!')
      .build();
  }

  get key(): string {
    return 'playback-skip';
  }

  get shortKey(): (string | null) {
    return 'skip';
  }

  get helpMessage(): string {
    return 'Pomija utwory. Parameter `amount` ma domyślną wartość `1`. Aby pominąć wszystkie utwory `amount` może mieć wartość `all`';
  }

  get exampleUsages(): string[] {
    return [
      '',
      '3',
      'all',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder()
      .withOptionalOr('amount', '"all"')
      .build();
  }
}

export { PlaybackSkipCommand };
