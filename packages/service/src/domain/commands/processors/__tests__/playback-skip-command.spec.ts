import { Command } from '@service/domain/commands/model/command';
import { PlaybackSkipCommand } from '@service/domain/commands/processors/playback-skip-command';
import { PlayerEventStream } from '@service/event-stream/player-event-stream';

jest.mock('@service/domain/commands/registry/register-command');
jest.mock('@service/event-stream/player-event-stream');

describe('playback-skip command', () => {
  const PlayerEventStreamMock = PlayerEventStream as unknown as jest.Mock<PlayerEventStream>;
  const playerEventStream = new PlayerEventStreamMock();
  const commandProcessor = new PlaybackSkipCommand(playerEventStream);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should skip one song by default', async () => {
    // given
    const command = new Command('skip', '');

    // when
    const response = await commandProcessor.execute(command);

    // then
    expect(playerEventStream.sendToEveryone).toHaveBeenCalledTimes(1);
    expect(playerEventStream.sendToEveryone).toHaveBeenCalledWith({
      id: 'SkipEvent',
      skipAll: false,
      amount: 1,
    });

    expect(response).toBeSingleTextCommandResponse('Lecimy dalej!');
  });

  it('should skip all songs', async () => {
    // given
    const command = new Command('skip', 'all');

    // when
    const response = await commandProcessor.execute(command);

    // then
    expect(playerEventStream.sendToEveryone).toHaveBeenCalledTimes(1);
    expect(playerEventStream.sendToEveryone).toHaveBeenCalledWith({
      id: 'SkipEvent',
      skipAll: true,
      amount: 1,
    });

    expect(response).toBeSingleTextCommandResponse('Lecimy dalej!');
  });

  it('should skip specified amount of songs', async () => {
    // given
    const command = new Command('skip', '123');

    // when
    const response = await commandProcessor.execute(command);

    // then
    expect(playerEventStream.sendToEveryone).toHaveBeenCalledTimes(1);
    expect(playerEventStream.sendToEveryone).toHaveBeenCalledWith({
      id: 'SkipEvent',
      skipAll: false,
      amount: 123,
    });

    expect(response).toBeSingleTextCommandResponse('Lecimy dalej!');
  });

  describe('error handling', () => {
    it('should throw when specified amount is not a number', async () => {
      // given
      const command = new Command('skip', 'not-a-number');

      // then
      await expect(commandProcessor.execute(command)).rejects.toThrow(Error);
    });

    it('should throw when specified amount is zero', async () => {
      // given
      const command = new Command('skip', '0');

      // then
      await expect(commandProcessor.execute(command)).rejects.toThrow(Error);
    });

    it('should throw when specified amount is less than zero', async () => {
      // given
      const command = new Command('skip', '-123');

      // then
      await expect(commandProcessor.execute(command)).rejects.toThrow(Error);
    });
  });
});
