import { Service } from 'typedi';

@Service()
class Configuration {
  public readonly PORT: string;
  public readonly DATABASE_NAME: string;
  public readonly MONGODB_URI: string;
  public readonly YOUTUBE_API_KEY: string;
  public readonly SLACK_CHANNEL_ID: string;
  public readonly COMMAND_PROMPT: string;
  public readonly DROPBOX_TOKEN: string;
  public readonly LOCALE: string;

  private constructor(
    PORT: string,
    DATABASE_NAME: string,
    MONGODB_URI: string,
    YOUTUBE_API_KEY: string,
    SLACK_CHANNEL_ID: string,
    COMMAND_PROMPT: string,
    DROPBOX_TOKEN: string,
    LOCALE: string,
  ) {
    this.PORT = PORT;
    this.DATABASE_NAME = DATABASE_NAME;
    this.MONGODB_URI = MONGODB_URI;
    this.YOUTUBE_API_KEY = YOUTUBE_API_KEY;
    this.SLACK_CHANNEL_ID = SLACK_CHANNEL_ID;
    this.COMMAND_PROMPT = COMMAND_PROMPT;
    this.DROPBOX_TOKEN = DROPBOX_TOKEN;
    this.LOCALE = LOCALE;
  }

  public static readFromEnv(): Configuration {
    return new Configuration(
      (process.env.PORT || '9000'),
      'lebkuchen-fm',
      process.env.MONGODB_URI || 'mongodb://localhost:27017',
      process.env.YOUTUBE_API_KEY || '',
      process.env.SLACK_CHANNEL_ID || '',
      process.env.COMMAND_PROMPT || '/fm',
      process.env.DROPBOX_TOKEN || '',
      process.env.LOCALE || 'pl',
    );
  }
}

export { Configuration };
