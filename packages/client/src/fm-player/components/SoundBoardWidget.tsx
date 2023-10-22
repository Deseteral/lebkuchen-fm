import * as React from 'react';
import clsx from 'clsx';
import { SoundIcon } from '../icons/SoundIcon';
import { SoundBoard } from '../../sound-board/components/SoundBoard';

function SoundBoardWidget() {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const toggleSoundBoardView = () => setIsExpanded((previousValue) => !previousValue);
  const hideSoundBoardView = () => setIsExpanded(false);

  React.useEffect(() => {
    const handleKeyDownEvent = (event: KeyboardEvent) => {
      if (event.code === 'KeyK' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSoundBoardView();
      }

      if (event.code === 'Escape') {
        hideSoundBoardView();
      }
    };

    document.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
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
