import { CommandProcessingResponse } from '../../../domain/commands/model/command-processing-response';

export interface TextCommandResponseDto {
  textResponse: string,
}

export function mapCommandProcessingResponseToTextCommandResponseDto(processingResponse: CommandProcessingResponse): TextCommandResponseDto {
  const textResponse = processingResponse.messages
    .map((message) => (('text' in message) ? message.text : null))
    .filter((s) => (s !== null))
    .join('\n');
  return { textResponse };
}
