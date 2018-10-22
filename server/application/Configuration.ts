interface Configuration {
  DATABASE_NAME: string;
  MONGODB_URI: string;
  YOUTUBE_API_KEY: (string | null);
  CHANNEL_NAME: string;
}

const configuration: Configuration = {
  DATABASE_NAME: 'lebkuchen-fm',
  MONGODB_URI: process.env['MONGO_URI'] || 'mongodb://localhost:27017',
  YOUTUBE_API_KEY: process.env['YOUTUBE_KEY'] || null,
  CHANNEL_NAME: process.env['CHANNEL_NAME'] || 'lebkuchen-fm',
};

export default configuration;
