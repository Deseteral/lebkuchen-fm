import { Service } from 'typedi';
import { SayEvent } from '../../../event-stream/model/events';
import Command from '../model/command';
import { CommandProcessingResponse } from '../model/command-processing-response';
import PlayerEventStream from '../../../event-stream/player-event-stream';
import CommandProcessor from '../model/command-processor';
import RegisterCommand from '../registry/register-command';

@RegisterCommand
@Service()
class SayCommand extends CommandProcessor {
  constructor(private playerEventStream: PlayerEventStream) {
    super();
  }

  async execute(command: Command): Promise<CommandProcessingResponse> {
    const text = command.rawArgs;
    const eventMessage: SayEvent = {
      id: 'SayEvent',
      text,
    };

    this.playerEventStream.sendToEveryone(eventMessage);

    return {
      messages: [
        { text: `_"${text}"_`, type: 'MARKDOWN' },
      ],
      isVisibleToIssuerOnly: false,
    };
  }

  get key(): string {
    return 'say';
  }

  get shortKey(): string | null {
    return null;
  }

  get helpMessage(): string {
    return 'Prosi spikera o odczytanie wiadomości';
  }

  get helpUsages(): string[] | null {
    return [
      '<message>',
      'to jest moja fantastyczna wiadomość',
    ];
  }
}

export default SayCommand;
