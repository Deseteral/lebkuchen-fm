import * as React from 'react';

interface SearchProps {
  onPhraseChange: (phrase: string) => void,
}

function Search({ onPhraseChange }: SearchProps) {
  return (
    <div className="relative p-4 min-w-full">
      <input
        type="search"
        className="bg-purple-white shadow rounded border-0 p-3 w-6/12"
        placeholder="Filter sounds..."
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onChange={(e) => onPhraseChange(e.target.value)}
      />
    </div>
  );
}

export default Search;
