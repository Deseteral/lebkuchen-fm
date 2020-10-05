import fetch from 'node-fetch';
import * as Configuration from '../application/configuration';

// TODO: Sort youtube package into correct folder

const { YOUTUBE_API_KEY } = Configuration.read();
const YOUTUBE_DATA_BASE_URL = 'https://www.googleapis.com/youtube/v3';

async function request<T>(url: string): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, { headers });
  return res.json();
}

function getSearchUrl(phrase: string): string {
  // TODO: Use URL instead https://nodejs.org/api/url.html
  const query = encodeURI(phrase);
  return `${YOUTUBE_DATA_BASE_URL}/search?q=${query}&maxResults=1&part=snippet&key=${YOUTUBE_API_KEY}`;
}

function getVideoUrl(youtubeId: string): string {
  return `${YOUTUBE_DATA_BASE_URL}/videos?part=id%2Csnippet&id=${youtubeId}&key=${YOUTUBE_API_KEY}`;
}

interface SearchResults {
  items: [
    {
      id: { videoId: string },
      snippet: { title:string },
    }
  ]
}

async function getSearchResults(phrase: string): Promise<SearchResults> {
  const url = getSearchUrl(phrase);
  const data = await request<SearchResults>(url);
  return data;
}

interface VideoDetails {
  items: [
    {
      snippet: { title:string },
    }
  ]
}

async function getVideoDetails(youtubeId: string): Promise<VideoDetails> {
  const url = getVideoUrl(youtubeId);
  const data = await request<VideoDetails>(url);
  return data;
}

export {
  getSearchResults,
  getVideoDetails,
};
