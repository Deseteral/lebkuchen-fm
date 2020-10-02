import * as YouTubeDataClient from './youtube-data-client';

async function fetchVideoTitleForId(youtubeId: string): Promise<string> {
  const videoDetails = await YouTubeDataClient.getVideoDetails(youtubeId);
  return videoDetails.items[0].snippet.title;
}

export {
  fetchVideoTitleForId,
};
