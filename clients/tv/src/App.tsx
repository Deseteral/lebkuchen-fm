import React from 'react';
import 'typeface-pacifico';
import './App.css';


const App: React.FC = () => {
  return (
    <div className="app">
        <div className="player">
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/CnUT2KIvtSM?autoplay=1" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title="LebkuchenFM Player"></iframe>
        </div>

        <div className="player-logo">
            <span className="player-logo-text">
                LebkuchenFM
            </span>
        </div>

        <div className="counter">
            <div className="counter-face" />
            <div className="counter-text">
                10
            </div>
        </div>

        <div className="next">
            <span className="next-label">Juz za chwile</span>
            <span className="next-title">Kropson - Super buty</span>
        </div>

    </div>
  );
}

export default App;
