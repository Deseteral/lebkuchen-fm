import youtubeQueue from './queue/youtubeQueue';
import * as YouTubePlayer from 'youtube-player';

const YT_ENDED = 0;
const YT_CUED = 5;

let player = null;
let nowPlaying = {};
const subscribers = {
  videoChange: new Set(),
};

function playNextVideo() {
  const youtubeVideo = youtubeQueue.pop();
  if (youtubeVideo) {
    playYoutubeVideo(youtubeVideo)
  } else {
    player.stopVideo();
  }
}

function playYoutubeVideo(youtubeVideo) {
  player.loadVideoById(youtubeVideo.youtubeId);
  player.playVideo();
  nowPlaying = youtubeVideo;
  triggerOnVideoChange();
}

function initPlayer(domId) {
  player = YouTubePlayer('yt-player');

  player.on('stateChange', (event) => {
    if (event.data === YT_ENDED) {
      playNextVideo();
    }
  });

  player.on('error', (event) => {
    console.error('ERROR', event);
    playNextVideo();
  });

  youtubeQueue.setOnAddListener(() => {
    player.getPlayerState().then((playerState) => {
      if ([YT_ENDED, YT_CUED].indexOf(playerState) >= 0) {
        playNextVideo();
      }
    });
  })
}

function changeVolume(val) {
  return player.setVolume(val);
}

function triggerOnVideoChange(){
  subscribers.videoChange.forEach((callback) => callback(nowPlaying));
}

function setOnVideoChangeListener(callback) {
  subscribers.videoChange.add(callback);
}

function resumeYoutubeVideo(callback) {
  player.playVideo();
}

function pauseYoutubeVideo() {
  return player.pauseVideo();
}

export default {
  changeVolume,
  initPlayer,
  playNextVideo,
  playYoutubeVideo,
  resumeYoutubeVideo,
  setOnVideoChangeListener,
  pauseYoutubeVideo,
}
