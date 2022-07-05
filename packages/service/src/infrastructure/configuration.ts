import { Service } from 'typedi';

@Service()
class Configuration {
  public readonly COMMAND_PROMPT: string;
  public readonly DISCORD_CHANNEL_ID: string;
  public readonly DISCORD_CLIENT_ID: string;
  public readonly DISCORD_GUILD_ID: string;
  public readonly DISCORD_TOKEN: string;
  public readonly DROPBOX_TOKEN: string;
  public readonly LOCALE: string;
  public readonly MONGODB_URI: string;
  public readonly PORT: string;
  public readonly YOUTUBE_API_KEY: string;

  private constructor(
    COMMAND_PROMPT: string,
    DISCORD_CHANNEL_ID: string,
    DISCORD_CLIENT_ID: string,
    DISCORD_GUILD_ID: string,
    DISCORD_TOKEN: string,
    DROPBOX_TOKEN: string,
    LOCALE: string,
    MONGODB_URI: string,
    PORT: string,
    YOUTUBE_API_KEY: string,
  ) {
    this.COMMAND_PROMPT = COMMAND_PROMPT;
    this.DISCORD_CHANNEL_ID = DISCORD_CHANNEL_ID;
    this.DISCORD_CLIENT_ID = DISCORD_CLIENT_ID;
    this.DISCORD_GUILD_ID = DISCORD_GUILD_ID;
    this.DISCORD_TOKEN = DISCORD_TOKEN;
    this.DROPBOX_TOKEN = DROPBOX_TOKEN;
    this.LOCALE = LOCALE;
    this.MONGODB_URI = MONGODB_URI;
    this.PORT = PORT;
    this.YOUTUBE_API_KEY = YOUTUBE_API_KEY;
  }

  public static readFromEnv(): Configuration {
    return new Configuration(
      process.env.COMMAND_PROMPT || '/fm',
      process.env.DISCORD_CHANNEL_ID || '',
      process.env.DISCORD_CLIENT_ID || '',
      process.env.DISCORD_GUILD_ID || '',
      process.env.DISCORD_TOKEN || '',
      process.env.DROPBOX_TOKEN || '',
      process.env.LOCALE || 'pl',
      process.env.MONGODB_URI || 'mongodb://localhost:27017',
      process.env.PORT || '9000',
      process.env.YOUTUBE_API_KEY || '',
    );
  }
}

export { Configuration };
