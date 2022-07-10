import { CommandProcessingResponse } from '@service/domain/commands/model/command-processing-response';

export interface TextCommandResponseDto {
  textResponse: string,
}

export function mapCommandProcessingResponseToTextCommandResponseDto(processingResponse: CommandProcessingResponse): TextCommandResponseDto {
  return {
    textResponse: processingResponse.message.markdown,
  };
}
