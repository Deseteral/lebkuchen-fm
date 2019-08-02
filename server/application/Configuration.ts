interface Configuration {
  DATABASE_NAME: string;
  MONGODB_URI: string;
  YOUTUBE_API_KEY: (string | null);
  SLACK_CHANNEL_ID: string;
  COMMAND: string;
}

const configuration: Configuration = {
  DATABASE_NAME: 'lebkuchen-fm',
  MONGODB_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
  YOUTUBE_API_KEY: process.env.YOUTUBE_KEY || null,
  SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID || '',
  COMMAND: process.env.COMMAND || '/fm',
};

export default configuration;
