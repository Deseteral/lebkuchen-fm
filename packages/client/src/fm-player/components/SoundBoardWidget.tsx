import * as React from 'react';
import clsx from 'clsx';
import { SoundIcon } from '../icons/SoundIcon';
import { SoundBoard } from '../../sound-board/components/SoundBoard';

function SoundBoardWidget() {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const toggleSoundBoardView = () => setIsExpanded((previousValue) => !previousValue);

  React.useEffect(() => {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyK' && event.metaKey) {
        toggleSoundBoardView();
      }
    });
  }, []);

  return (
    <div
      className={clsx('sound-board-layer', isExpanded && 'expanded')}
    >
      <button onClick={toggleSoundBoardView} type="button" className="sound-board-layer-button">
        <SoundIcon />
      </button>
      <SoundBoard />
    </div>
  );
}
export { SoundBoardWidget };
