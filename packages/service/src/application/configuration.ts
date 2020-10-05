interface Configuration {
  PORT: string,
  DATABASE_NAME: string,
  MONGODB_URI: string,
  YOUTUBE_API_KEY: (string | null),
  SLACK_CHANNEL_ID: string,
  COMMAND_PROMPT: string,
}

// TODO: Remove call to read function
function read(): Configuration {
  // TODO: Update documentation
  return {
    PORT: (process.env.PORT || '9000'),
    DATABASE_NAME: 'lebkuchen-fm',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || null,
    SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID || '',
    COMMAND_PROMPT: process.env.COMMAND_PROMPT || '/fm',
  };
}

export { read };
