import * as React from 'react';
import { SearchIcon } from '../icons/SearchIcon';
import { playRandomSongFromHistory, playSongByPhrase, playSongByYoutubeIdCommand } from '../services/player-commands';

function Search() {
  const [isFormExpanded, setIsFormExpanded] = React.useState<boolean>(false);
  const [searchPhrase, setSearchPhrase] = React.useState<string>('');

  const toggleIsFormExpanded = () => setIsFormExpanded((previousValue) => !previousValue);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (searchPhrase.startsWith('/q')) {
      playSongByYoutubeIdCommand(searchPhrase.replace('/q', '').trim());
    } else if (searchPhrase.startsWith('/r')) {
      playRandomSongFromHistory(searchPhrase.replace('/r', '').trim());
    } else {
      playSongByPhrase(searchPhrase);
    }

    setSearchPhrase('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.code === 'Escape') {
      setIsFormExpanded(false);
      setSearchPhrase('');
    }
  };

  React.useEffect(() => {
    const handleKeyDownEvent = (event: KeyboardEvent) => {
      if (event.code === 'KeyF' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleIsFormExpanded();
      }
    };

    document.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, []);

  return (
    <div
      className="bg-green-400 rounded-full flex flex-row"
    >
      <button
        onClick={toggleIsFormExpanded}
        type="button"
        className="p-2 hover:bg-green-600 text-2xl rounded-full"
      >
        <SearchIcon />
      </button>
      {isFormExpanded && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="rounded-full h-full px-4 outline-none"
            placeholder="Szukaj"
            onChange={(event) => setSearchPhrase(event.target.value.trimStart())}
            value={searchPhrase}
            required
            onKeyDown={handleKeyPress}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      )}
    </div>
  );
}
export { Search };
