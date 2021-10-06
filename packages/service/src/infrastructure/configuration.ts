require('dotenv').config();

interface ConfigurationT {
  PORT: string,
  DATABASE_NAME: string,
  MONGODB_URI: string,
  YOUTUBE_API_KEY: string,
  SLACK_CHANNEL_ID: string,
  COMMAND_PROMPT: string,
  DROPBOX_TOKEN: string,
}

const Configuration: ConfigurationT = {
  PORT: (process.env.PORT || '9000'),
  DATABASE_NAME: 'lebkuchen-fm',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || '',
  SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID || '',
  COMMAND_PROMPT: process.env.COMMAND_PROMPT || '/fm',
  DROPBOX_TOKEN: process.env.DROPBOX_TOKEN || '',
};

export default Configuration;
