import * as React from 'react';
import { SoundIcon } from '../icons/SoundIcon';
import { SoundBoard } from '../../sound-board/components/SoundBoard';

function SoundBoardWidget() {
  const soundBoardLayer = React.useRef<HTMLDivElement>(null);

  const toggleSoundBoardView = () => {
    if (soundBoardLayer.current) {
      soundBoardLayer.current.classList.toggle('expanded');
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyK' && event.metaKey) {
        toggleSoundBoardView();
      }
    });
  }, []);

  return (
    <div ref={soundBoardLayer} className="sound-board-layer">
      <button onClick={toggleSoundBoardView} type="button" className="sound-board-layer-button">
        <SoundIcon />
      </button>
      <SoundBoard />
    </div>
  );
}
export { SoundBoardWidget };
