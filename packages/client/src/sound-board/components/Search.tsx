import * as React from 'react';
import { useFocus } from '../../hooks/useFocus';
import { useKeyStroke } from '../../hooks/useKeyStroke';
import { getPlatform } from '../../services/get-platform';

interface SearchProps {
  value: string,
  onPhraseChange: (phrase: string) => void,
  onSubmit: (event: React.KeyboardEvent) => void,
  onEscape: () => void,
}

function Search({ value, onPhraseChange, onSubmit, onEscape }: SearchProps) {
  const [searchRef, setSearchFocus] = useFocus<HTMLInputElement>();
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') onSubmit(event);
    if (event.key === 'Escape') onEscape();
  };

  const searchFocusKeystrokeConfig = getPlatform() === 'mac'
    ? { key: 'k', metaKey: true }
    : { key: 'k', ctrlKey: true };

  useKeyStroke(searchFocusKeystrokeConfig, setSearchFocus);

  return (
    <div className="relative p-4 min-w-full">
      <input
        type="search"
        className="bg-purple-white shadow rounded border-0 p-3 w-full sm:w-6/12"
        placeholder="Filter sounds..."
        value={value}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onChange={(e) => onPhraseChange(e.target.value)}
        onKeyDown={onKeyDown}
        ref={searchRef}
      />
    </div>
  );
}

export { Search };
