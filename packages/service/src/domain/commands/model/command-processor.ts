import Command from './command';
import CommandProcessingResponse from './command-processing-response';

abstract class CommandProcessor {
  abstract execute(command: Command): Promise<CommandProcessingResponse>

  abstract get key(): string;
  abstract get shortKey(): (string | null);
  abstract get helpMessage(): string;
  abstract get helpUsages(): (string[] | null);
}

export default CommandProcessor;
