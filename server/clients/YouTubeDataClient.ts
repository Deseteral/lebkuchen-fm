import nodeFetch from 'node-fetch';
import Configuration from '../application/Configuration';

const YOUTUBE_API_KEY = Configuration.YOUTUBE_API_KEY;
const YOUTUBE_DATA_BASE_URL = 'https://www.googleapis.com/youtube/v3';

function request(url: string) {
  const headers = {
    'Content-Type': 'application/json',
  };

  return nodeFetch(url, { headers }).then(data => data.json());
}

function getSearchUrl(phrase: string) {
  const query = encodeURI(phrase);

  const url = YOUTUBE_DATA_BASE_URL +
    '/search' +
    `?q=${query}` +
    '&maxResults=1&part=snippet' +
    `&key=${YOUTUBE_API_KEY}`;

  return url;
}

function getVideoUrl(youtubeId: string) {
  const url = YOUTUBE_DATA_BASE_URL +
    '/videos' +
    '?part=id%2Csnippet' +
    `&id=${youtubeId}` +
    `&key=${YOUTUBE_API_KEY}`;

  return url;
}

async function getSearchResults(phrase: string) {
  const url = getSearchUrl(phrase);
  const data = await request(url);
  return data;
}

async function getVideoDetails(youtubeId: string) {
  const url = getVideoUrl(youtubeId);
  const data = await request(url);
  return data;
}

export default {
  getSearchResults,
  getVideoDetails,
};
