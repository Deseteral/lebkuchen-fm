interface Configuration {
  DATABASE_NAME: string;
  MONGODB_URI: string;
  YOUTUBE_API_KEY: (string | null);
}

const configuration: Configuration = {
  DATABASE_NAME: 'lebkuchen-fm',
  MONGODB_URI: process.env['MONGO_URI'] || 'mongodb://localhost:27017',
  YOUTUBE_API_KEY: 'AIzaSyAbDSjGvqpSc0yqY5HN7MfYflklSK1RWxQ', // process.env['YOUTUBE_KEY'] || null,
};

export default configuration;
