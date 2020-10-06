import CommandProcessingResponse from '../../../domain/commands/model/command-processing-response';

interface TextCommandResponseDto {
  textResponse: string,
}

function mapCommandProcessingResponseToTextCommandResponseDto(processingResponse: CommandProcessingResponse) // eslint-disable-line max-len
: TextCommandResponseDto {
  const textResponse = processingResponse.messages.map((message) => message.text).join('\n');
  return { textResponse };
}

export default TextCommandResponseDto;
export {
  mapCommandProcessingResponseToTextCommandResponseDto,
};
