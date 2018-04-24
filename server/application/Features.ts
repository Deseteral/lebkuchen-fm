import Configuration from './Configuration';

function isYouTubeDataAvailable() {
  return !!Configuration.YOUTUBE_API_KEY;
}

export default {
  isYouTubeDataAvailable,
};
