import fetch from 'node-fetch';
import * as Configuration from '../application/configuration';
import * as Logger from '../infrastructure/logger';

function makeYouTubeUrl(path: string): URL {
  const url = new URL(`/youtube/v3${path}`, 'https://www.googleapis.com');
  url.searchParams.set('key', Configuration.read().YOUTUBE_API_KEY);
  return url;
}

async function request<T>(url: URL): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();

  if (data.error) {
    Logger.error(data.error.message, 'youtube-data-client');
    throw new Error(data.error.message);
  }

  return data;
}

// function getSearchUrl(phrase: string): URL {
//   const url = new URL(`${YOUTUBE_DATA_BASE_URL}/search`);
//   url.searchParams.set('q', encodeURI(phrase)); // encodeURI is probably not needed
//   url.searchParams.set('part', 'snippet');
//   url.searchParams.set('maxResults', '1');
//   return url;
// }

// interface SearchResults {
//   items: [
//     {
//       id: { videoId: string },
//       snippet: { title: string },
//     }
//   ]
// }

// async function getSearchResults(phrase: string): Promise<SearchResults> {
//   const url = getSearchUrl(phrase).toString();
//   const data = await request<SearchResults>(url);
//   return data;
// }

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

export {
  fetchVideoTitleForId,
};
