import * as React from 'react';
import youtubePlayer from '../../services/youtubePlayer';

class NowPlaying extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowPlaying: '',
    },
    youtubePlayer.setOnVideoChangeListener((video) => {
      this.setState({ nowPlaying: video.name });
    });
  }

  render() {
    const nowPlaying = [
      <span key='a' className="dimmed">now playing </span>,
      this.state.nowPlaying,
      <span key='b' className="dimmed">now playing </span>
    ];

    return (
      <div className="status-container">
        {this.state.nowPlaying && (
          React.createElement(
          'marquee',
          {
            children: nowPlaying,
            className: 'status',
            direction: 'right',
            scrollamount: '10',
          }
        )
        )}
      </div>
    )
  }

}

export default NowPlaying;

//
// <div className="status">
//   <span className="dimmed"> now playing </span>
//   {this.state.nowPlaying}
//   <span className="dimmed"> now playing </span>
// </div>
