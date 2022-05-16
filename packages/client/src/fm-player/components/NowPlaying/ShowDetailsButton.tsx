import * as React from 'react';
import { InfoIcon } from '../../icons/InfoIcon';

interface ShowDetailsButtonProps {
  onClick: () => void,
}

function ShowDetailsButton({ onClick }: ShowDetailsButtonProps) {
  return (
    <div
      className="absolute top-2 right-2 outline-none"
      role="button"
      onClick={onClick}
      tabIndex={0}
      aria-hidden="true"
    >
      <InfoIcon />
    </div>
  );
}

export { ShowDetailsButton };
