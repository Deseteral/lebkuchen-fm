import * as React from 'react';
import './AnimatedBackground.css';

function AnimatedBackground() {
  return (
    <div>
      <div id="retrobg">
        <div id="retrobg-sky">
          <div id="retrobg-stars">
            <div className="retrobg-star left:  5%; top: 55%; transform: scale( 2 );" />
            <div className="retrobg-star left:  7%; top:  5%; transform: scale( 2 );" />
            <div className="retrobg-star left: 10%; top: 45%; transform: scale( 1 );" />
            <div className="retrobg-star left: 12%; top: 35%; transform: scale( 1 );" />
            <div className="retrobg-star left: 15%; top: 39%; transform: scale( 1 );" />
            <div className="retrobg-star left: 20%; top: 10%; transform: scale( 1 );" />
            <div className="retrobg-star left: 35%; top: 50%; transform: scale( 2 );" />
            <div className="retrobg-star left: 40%; top: 16%; transform: scale( 2 );" />
            <div className="retrobg-star left: 43%; top: 28%; transform: scale( 1 );" />
            <div className="retrobg-star left: 45%; top: 30%; transform: scale( 3 );" />
            <div className="retrobg-star left: 55%; top: 18%; transform: scale( 1 );" />
            <div className="retrobg-star left: 60%; top: 23%; transform: scale( 1 );" />
            <div className="retrobg-star left: 62%; top: 44%; transform: scale( 2 );" />
            <div className="retrobg-star left: 67%; top: 27%; transform: scale( 1 );" />
            <div className="retrobg-star left: 75%; top: 10%; transform: scale( 2 );" />
            <div className="retrobg-star left: 80%; top: 25%; transform: scale( 1 );" />
            <div className="retrobg-star left: 83%; top: 57%; transform: scale( 1 );" />
            <div className="retrobg-star left: 90%; top: 29%; transform: scale( 2 );" />
            <div className="retrobg-star left: 95%; top:  5%; transform: scale( 1 );" />
            <div className="retrobg-star left: 96%; top: 72%; transform: scale( 1 );" />
            <div className="retrobg-star left: 98%; top: 70%; transform: scale( 3 );" />
          </div>
          <div id="retrobg-sunWrap">
            <div id="retrobg-sun" />
          </div>
          <div id="retrobg-mountains">
            <div id="retrobg-mountains-left" className="retrobg-mountain" />
            <div id="retrobg-mountains-right" className="retrobg-mountain" />
          </div>
        </div>
        <div id="retrobg-ground">
          <div id="retrobg-linesWrap">
            <div id="retrobg-lines">
              <div id="retrobg-vlines">
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
                <div className="retrobg-vline" />
              </div>
              <div id="retrobg-hlines">
                <div className="retrobg-hline" />
                <div className="retrobg-hline" />
                <div className="retrobg-hline" />
                <div className="retrobg-hline" />
                <div className="retrobg-hline" />
                <div className="retrobg-hline" />
                <div className="retrobg-hline" />
                <div className="retrobg-hline" />
              </div>
            </div>
          </div>
          <div id="retrobg-groundShadow" />
        </div>
      </div>
    </div>
  );
}

export { AnimatedBackground };
