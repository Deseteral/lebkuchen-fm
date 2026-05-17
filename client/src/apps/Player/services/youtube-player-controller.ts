import YouTubePlayer from 'yt-player';

// TODO: Remove 'events' package from dependencies once we get rid of the yt-player.
//       Right now the project will throw an error on startup without it.
//       See: https://github.com/feross/yt-player/issues/73
//       ~Deseteral, 2025-01-23

interface YoutubePlayerCallbacks {
  onPlaying: () => void;
  onPaused: () => void;
  onTimeUpdate: (seconds: number) => void;
  onEnded: () => void;
}

class YoutubePlayerController {
  private static player: YouTubePlayer;

  static isInitialized(): boolean {
    return !!YoutubePlayerController.player && !YoutubePlayerController.player.destroyed;
  }

  static initialize(elementId: string, callbacks: YoutubePlayerCallbacks): void {
    YoutubePlayerController.player = new YouTubePlayer(`#${elementId}`, {
      host: 'https://www.youtube-nocookie.com',
    });
    YoutubePlayerController.player.setVolume(100);
    YoutubePlayerController.player.setPlaybackQuality('highres');

    YoutubePlayerController.player.on('playing', callbacks.onPlaying);
    YoutubePlayerController.player.on('paused', callbacks.onPaused);
    YoutubePlayerController.player.on('timeupdate', callbacks.onTimeUpdate);
    YoutubePlayerController.player.on('ended', callbacks.onEnded);
    YoutubePlayerController.player.on('error', callbacks.onEnded);
    YoutubePlayerController.player.on('unplayable', callbacks.onEnded);
  }

  static destroy(): void {
    if (YoutubePlayerController.player && !YoutubePlayerController.player.destroyed) {
      YoutubePlayerController.player.destroy();
    }
  }

  static load(youtubeId: string): void {
    YoutubePlayerController.player.load(youtubeId, true);
  }

  static play(): void {
    YoutubePlayerController.player.play();
  }

  static pause(): void {
    YoutubePlayerController.player.pause();
  }

  static stop(): void {
    YoutubePlayerController.player.stop();
  }

  static seek(time: number): void {
    YoutubePlayerController.player.seek(time);
  }

  static setVolume(volume: number): void {
    YoutubePlayerController.player.setVolume(volume);
  }

  static setPlaybackRate(rate: number): void {
    YoutubePlayerController.player.setPlaybackRate(rate);
  }

  static setPlaybackQuality(
    quality: 'small' | 'medium' | 'large' | 'hd720' | 'hd1080' | 'highres' | 'default',
  ): void {
    YoutubePlayerController.player.setPlaybackQuality(quality);
  }

  static getPlaybackRate(): number {
    return YoutubePlayerController.player.getPlaybackRate();
  }

  static getAvailablePlaybackRates(): number[] {
    return YoutubePlayerController.player.getAvailablePlaybackRates();
  }

  static getState(): string {
    return YoutubePlayerController.player.getState();
  }

  static getCurrentTime(): number {
    return YoutubePlayerController.player.getCurrentTime();
  }

  static getDuration(): number {
    return YoutubePlayerController.player.getDuration();
  }
}

export { YoutubePlayerController };
