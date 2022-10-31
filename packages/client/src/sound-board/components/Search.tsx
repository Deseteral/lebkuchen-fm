import * as React from 'react';

interface SearchProps {
  value: string,
  onPhraseChange: (phrase: string) => void,
  onSubmit: () => void,
  onEscape: () => void,
}

function Search({ value, onPhraseChange, onSubmit, onEscape }: SearchProps) {
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') onSubmit();
    if (event.key === 'Escape') onEscape();
  };

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
      />
    </div>
  );
}

export { Search };
