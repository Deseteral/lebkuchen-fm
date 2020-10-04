import YouTubePlayer from 'youtube-player';

function initialize(domId: string) {
  const player = YouTubePlayer('yt-player');

  // player.on('stateChange', (event) => {
  //   if (event.data === YT_ENDED) {
  //     playNextVideo();
  //   }
  // });

  // player.on('error', (event) => {
  //   console.error('ERROR', event);
  //   playNextVideo();
  // });

  // youtubeQueue.setOnAddListener(() => {
  //   player.getPlayerState().then((playerState) => {
  //     if ([YT_ENDED, YT_CUED].indexOf(playerState) >= 0) {
  //       playNextVideo();
  //     }
  //   });
  // })
}

export {
  initialize,
};
