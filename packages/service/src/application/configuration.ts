function read() {
  // TODO: Update documentation
  return {
    PORT: (process.env.PORT || '9000'),
    DATABASE_NAME: 'lebkuchen-fm',
    MONGODB_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
    YOUTUBE_API_KEY: process.env.YOUTUBE_KEY || null,
    SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID || '',
    COMMAND_PROMPT: process.env.COMMAND_PROMPT || '/fm',
  };
}

export { read };
