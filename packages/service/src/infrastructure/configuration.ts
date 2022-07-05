import { Service } from 'typedi';

@Service()
class Configuration {
  public readonly PORT: string;
  public readonly MONGODB_URI: string;
  public readonly YOUTUBE_API_KEY: string;
  public readonly COMMAND_PROMPT: string;
  public readonly DISCORD_TOKEN: string;
  public readonly DISCORD_CLIENT_ID: string;
  public readonly DISCORD_GUILD_ID: string;
  public readonly DROPBOX_TOKEN: string;
  public readonly LOCALE: string;

  private constructor(
    PORT: string,
    MONGODB_URI: string,
    YOUTUBE_API_KEY: string,
    COMMAND_PROMPT: string,
    DISCORD_TOKEN: string,
    DISCORD_CLIENT_ID: string,
    DISCORD_GUILD_ID: string,
    DROPBOX_TOKEN: string,
    LOCALE: string,
  ) {
    this.PORT = PORT;
    this.MONGODB_URI = MONGODB_URI;
    this.YOUTUBE_API_KEY = YOUTUBE_API_KEY;
    this.COMMAND_PROMPT = COMMAND_PROMPT;
    this.DISCORD_TOKEN = DISCORD_TOKEN;
    this.DISCORD_CLIENT_ID = DISCORD_CLIENT_ID;
    this.DISCORD_GUILD_ID = DISCORD_GUILD_ID;
    this.DROPBOX_TOKEN = DROPBOX_TOKEN;
    this.LOCALE = LOCALE;
  }

  public static readFromEnv(): Configuration {
    return new Configuration(
      (process.env.PORT || '9000'),
      process.env.MONGODB_URI || 'mongodb://localhost:27017',
      process.env.YOUTUBE_API_KEY || '',
      process.env.COMMAND_PROMPT || '/fm',
      process.env.DISCORD_TOKEN || '',
      process.env.DISCORD_CLIENT_ID || '',
      process.env.DISCORD_GUILD_ID || '',
      process.env.DROPBOX_TOKEN || '',
      process.env.LOCALE || 'pl',
    );
  }
}

export { Configuration };
