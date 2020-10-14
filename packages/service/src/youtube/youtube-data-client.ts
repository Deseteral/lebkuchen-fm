import fetch from 'node-fetch';
import Configuration from '../infrastructure/configuration';
import Logger from '../infrastructure/logger';

const logger = new Logger('youtube-data-client');

function makeYouTubeUrl(path: string): URL {
  const url = new URL(`/youtube/v3${path}`, 'https://www.googleapis.com');
  url.searchParams.set('key', Configuration.YOUTUBE_API_KEY);
  return url;
}

async function request<T>(url: URL): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();

  if (data.error) {
    logger.error(data.error.message);
    throw new Error(data.error.message);
  }

  return data;
}

interface SearchResults {
  items: [
    {
      id: { videoId: string },
      snippet: { title: string },
    }
  ]
}

async function getSearchResultsForPhrase(phrase: string, maxResults: number): Promise<SearchResults> {
  const url = makeYouTubeUrl('/search');
  url.searchParams.set('q', phrase);
  url.searchParams.set('maxResults', maxResults.toString());
  url.searchParams.set('part', 'snippet');

  const data = await request<SearchResults>(url);
  return data;
}

interface VideoDetails {
  items: [
    {
      snippet: { title: string },
    }
  ]
}

async function getVideoDetails(youtubeId: string): Promise<VideoDetails> {
  const url = makeYouTubeUrl('/videos');
  url.searchParams.set('id', youtubeId);
  url.searchParams.set('part', 'id,snippet');

  return request<VideoDetails>(url);
}

async function fetchVideoTitleForId(youtubeId: string): Promise<string> {
  const videoDetails = await getVideoDetails(youtubeId);
  return videoDetails.items[0].snippet.title;
}

async function fetchFirstYouTubeIdForPhrase(phrase: string): Promise<string> {
  const data = await getSearchResultsForPhrase(phrase, 1);
  return data.items[0].id.videoId;
}

export {
  fetchVideoTitleForId,
  fetchFirstYouTubeIdForPhrase,
};
