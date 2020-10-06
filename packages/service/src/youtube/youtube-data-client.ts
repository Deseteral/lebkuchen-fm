import fetch from 'node-fetch';
import * as Configuration from '../application/configuration';

const { YOUTUBE_API_KEY } = Configuration.read();
const YOUTUBE_DATA_BASE_URL = 'https://www.googleapis.com/youtube/v3';

async function request<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

// function getSearchUrl(phrase: string): URL {
//   const url = new URL(`${YOUTUBE_DATA_BASE_URL}/search`);
//   url.searchParams.set('q', encodeURI(phrase)); // encodeURI is probably not needed
//   url.searchParams.set('part', 'snippet');
//   url.searchParams.set('maxResults', '1');
//   url.searchParams.set('key', YOUTUBE_API_KEY);
//   return url;
// }

function getVideoUrl(youtubeId: string): URL {
  const url = new URL(`${YOUTUBE_DATA_BASE_URL}/videos`);
  url.searchParams.set('id', youtubeId);
  url.searchParams.set('part', 'id,snippet');
  url.searchParams.set('key', YOUTUBE_API_KEY);
  return url;
}

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
  const url = getVideoUrl(youtubeId).toString();
  const data = await request<VideoDetails>(url);
  return data;
}

async function fetchVideoTitleForId(youtubeId: string): Promise<string> {
  const videoDetails = await getVideoDetails(youtubeId);
  return videoDetails.items[0].snippet.title;
}

export {
  fetchVideoTitleForId,
};
