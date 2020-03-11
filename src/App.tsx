import * as React from 'react';

import NowPlaying from './components/NowPlaying/NowPlaying';
import Queue from './components/Queue/Queue';
import YoutubePlayer from './components/YoutubePlayer/YoutubePlayer';
import TimeAlerts from './components/TimeAlerts/TimeAlerts';

class App extends React.Component {
  public render() {
    return (
      <div className="view">
        <div className="header-container">
          <div className="logo-container">
            <p className="logo-text">LebkuchenFM</p>
          </div>
        </div>

        <YoutubePlayer />
        <NowPlaying />
        <Queue />
        <TimeAlerts />

        <div className="footer-container">
          <div className="footer">
            <span>&copy; alright</span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
