import Features from '../application/Features';
import YouTubeDataClient from '../clients/YouTubeDataClient';

async function fetch(youtubeId: string) : Promise<string> {
  if (!Features.isYouTubeDataAvailable()) {
    return 'Nieznany film';
  }

  const videoDetails = await YouTubeDataClient.getVideoDetails(youtubeId);
  const title = videoDetails.items[0].snippet.title;
  return title;
}

export default {
  fetch,
};
