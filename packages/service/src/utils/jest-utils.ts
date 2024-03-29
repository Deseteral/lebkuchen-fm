import { CommandProcessingResponse } from '@service/domain/commands/model/command-processing-response';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSingleTextCommandResponse(text: string): R
    }
  }
}

expect.extend({
  toBeSingleTextCommandResponse(it, text) {
    const response = it as CommandProcessingResponse;
    const pass = (response.message.markdown === text);

    return {
      pass,
      message: (): string => `Expected  single text command processing response with "${text}" text`,
    };
  },
});

export {};
