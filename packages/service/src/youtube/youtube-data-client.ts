import Configuration from '@service/infrastructure/configuration';
import Logger from '@service/infrastructure/logger';
import fetch from 'node-fetch';
import { Service } from 'typedi';

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
      id: string,
      snippet: { title: string },
      status: {embeddable: boolean},
    }
  ]
}

@Service()
class YouTubeDataClient {
  private static logger: Logger = new Logger('youtube-data-client');

  constructor(private configuration: Configuration) { }

  async fetchVideoTitleForId(youtubeId: string): Promise<string> {
    const videoDetails = await this.getVideoDetails([youtubeId], 'snippet');
    const title = videoDetails.items[0]?.snippet?.title;
    if (!title) {
      throw new Error('Wideo o zadanym id nie zostało odnalezione');
    }
    return title;
  }

  async fetchFirstYouTubeIdForPhrase(phrase: string): Promise<string> {
    const data = await this.getSearchResultsForPhrase(phrase, 1);
    const videoId = data.items[0]?.id?.videoId;
    if (!videoId) {
      throw new Error('Nie znaleziono żadnego wideo dla podanej frazy');
    }
    return videoId;
  }

  async fetchVideosStatuses(youtubeIds: string[]): Promise<VideoDetails> {
    const videoDetails = await this.getVideoDetails(youtubeIds, 'status');
    return videoDetails;
  }

  private makeYouTubeUrl(path: string): URL {
    const url = new URL(`/youtube/v3${path}`, 'https://www.googleapis.com');
    url.searchParams.set('key', this.configuration.YOUTUBE_API_KEY);
    return url;
  }

  private async request<T>(url: URL): Promise<T> {
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

  private async getSearchResultsForPhrase(phrase: string, maxResults: number): Promise<SearchResults> {
    const url = this.makeYouTubeUrl('/search');
    url.searchParams.set('q', phrase);
    url.searchParams.set('maxResults', maxResults.toString());
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('safeSearch', 'none');
    url.searchParams.set('videoEmbeddable', 'true');

    const data = await this.request<SearchResults>(url);
    return data;
  }

  private async getVideoDetails(youtubeIds: string[], part: string): Promise<VideoDetails> {
    const url = this.makeYouTubeUrl('/videos');
    url.searchParams.set('id', youtubeIds.join(','));
    url.searchParams.set('part', part);

    return this.request<VideoDetails>(url);
  }
}

export default YouTubeDataClient;
