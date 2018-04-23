interface Configuration {
  YOUTUBE_API_KEY: (string | null);
}

const configuration: Configuration = {
  YOUTUBE_API_KEY: 'AIzaSyAFE3S5UUQR7wq99gBRjBN9_-4meA7vCLU', // process.env['YOUTUBE_KEY'] || null,
};

export default configuration;
