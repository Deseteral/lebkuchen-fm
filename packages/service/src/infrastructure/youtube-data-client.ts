import fetch from 'node-fetch';
import Configuration from './configuration';
import Logger from './logger';

interface SearchResults {
  items: [
    {
      id: { videoId: string },
      snippet: { title: string },
    }
  ]
}

interface VideoDetails {
  items: [
    {
      snippet: { title: string },
    }
  ]
}

class YouTubeDataClient {
  private static logger: Logger = new Logger('youtube-data-client');

  private static makeYouTubeUrl(path: string): URL {
    const url = new URL(`/youtube/v3${path}`, 'https://www.googleapis.com');
    url.searchParams.set('key', Configuration.YOUTUBE_API_KEY);
    return url;
  }

  private static async request<T>(url: URL): Promise<T> {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    if (data.error) {
      YouTubeDataClient.logger.error(data.error.message);
      throw new Error(data.error.message);
    }

    return data;
  }

  private static async getSearchResultsForPhrase(phrase: string, maxResults: number): Promise<SearchResults> {
    const url = YouTubeDataClient.makeYouTubeUrl('/search');
    url.searchParams.set('q', phrase);
    url.searchParams.set('maxResults', maxResults.toString());
    url.searchParams.set('part', 'snippet');

    const data = await YouTubeDataClient.request<SearchResults>(url);
    return data;
  }

  private static async getVideoDetails(youtubeId: string): Promise<VideoDetails> {
    const url = YouTubeDataClient.makeYouTubeUrl('/videos');
    url.searchParams.set('id', youtubeId);
    url.searchParams.set('part', 'id,snippet');

    return YouTubeDataClient.request<VideoDetails>(url);
  }

  static async fetchVideoTitleForId(youtubeId: string): Promise<string> {
    const videoDetails = await YouTubeDataClient.getVideoDetails(youtubeId);
    return videoDetails.items[0].snippet.title;
  }

  static async fetchFirstYouTubeIdForPhrase(phrase: string): Promise<string> {
    const data = await YouTubeDataClient.getSearchResultsForPhrase(phrase, 1);
    return data.items[0].id.videoId;
  }
}

export default YouTubeDataClient;
