import * as React from 'react';

function ExpandIcon({ isRotated = false }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={isRotated ? 'h-6 w-6 rotate-180' : 'h-6 w-6'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export { ExpandIcon };
