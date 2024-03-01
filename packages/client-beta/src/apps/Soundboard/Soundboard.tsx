import React, { useState, useRef } from 'react';
import { Window } from '@components/Window/Window';
import styles from './Soundboard.module.css';

function Soundboard() {
  const [showWindow, setShowWindow] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleWindow = () => {
    setShowWindow((prev) => !prev);
    if (buttonRef.current) {
      buttonRef.current.blur();
    }
  };

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        className={styles.app}
        onDoubleClick={toggleWindow}
        onKeyDown={(e) => e.key === 'Enter' && toggleWindow()}
      >
        <img
          className={styles.icon}
          src="https://cdn2.iconfinder.com/data/icons/gadgets-and-devices/48/60-512.png"
          alt=""
        />
        Soundboard.exe
      </button>
      {showWindow && (
        <Window startPosition={{ x: 400, y: 250 }} title="LebkuchenFM Soundboard" close={() => setShowWindow(false)}>
          <h4>soundboard</h4>
          <video controls>
            <source data-v-4a0e4859="" src="https://i1.jbzd.com.pl/contents/2024/02/SaSPGnYmWJNlp4H4vuK4R4w52EIiD8hk.mp4" type="video/mp4" />
          </video>
        </Window>
      )}
    </>
  );
}

export { Soundboard };
