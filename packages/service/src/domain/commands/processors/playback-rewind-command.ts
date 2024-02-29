import { Command } from '@service/domain/commands/model/command';
import { CommandProcessingResponse, CommandProcessingResponseBuilder } from '@service/domain/commands/model/command-processing-response';
import { CommandParameters, CommandParametersBuilder, CommandProcessor } from '@service/domain/commands/model/command-processor';
import { RegisterCommand } from '@service/domain/commands/registry/register-command';
import { RewindEvent } from '@service/event-stream/model/events';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';
import { parseToSeconds } from '@service/utils/utils';
import { Service } from 'typedi';

@RegisterCommand
@Service()
class RewindCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const timeArgument = command.rawArgs;
    if (!timeArgument) {
      throw new Error('Brak wymaganego argumentu. Wymagane podanie czasu w sekundach lub w formacie hh:mm:ss.');
    }

    const modifier = this.getModifier(timeArgument);
    const time = parseToSeconds(
      modifier ? timeArgument.slice(1) : timeArgument,
    );

    if (time === null) {
      throw new Error('Niepoprawny argument. Wymagane podanie czasu w sekundach lub w formacie hh:mm:ss.');
    }

    const event: RewindEvent = {
      id: 'RewindEvent',
      time,
      modifier,
    };

    this.playerEventStream.sendToEveryone(event);

    return new CommandProcessingResponseBuilder()
      .fromMarkdown(`Przewijamy ${modifier ? 'o' : 'do'} ${timeArgument}`)
      .build();
  }

  private getModifier(timeArgument: string): number | null {
    const isModifierPresent = timeArgument.search(/^(-|\+)/) > -1;
    if (!isModifierPresent) {
      return null;
    }

    return timeArgument.startsWith('-')
      ? -1
      : 1;
  }

  get key(): string {
    return 'playback-rewind';
  }

  get shortKey(): (string | null) {
    return 'rewind';
  }

  get helpMessage(): string {
    return 'Przewija odtwarzane wideo do podanego czasu lub o podany czas(modyfikatory +/-)';
  }

  get exampleUsages(): string[] {
    return [
      '10',
      '90',
      '1:30',
      '+10',
      '-1:01',
    ];
  }

  get parameters(): CommandParameters {
    return new CommandParametersBuilder()
      .withRequired('time')
      .build();
  }
}

export { RewindCommand };
