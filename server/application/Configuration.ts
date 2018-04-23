interface Configuration {
  YOUTUBE_API_KEY: (string | null);
}

const configuration: Configuration = {
  YOUTUBE_API_KEY: process.env['YOUTUBE_KEY'] || null,
};

export default configuration;
