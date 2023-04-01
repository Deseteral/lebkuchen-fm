import * as React from 'react';
import { useEffect, useRef } from 'react';
import './SoundButton.css';

interface SoundButtonProps {
  name: string,
  timesPlayed: number,
  onClick: () => void,
}

type refClassListReducerAction = 'add' | 'remove';
const refClassListReducer = (
  ref: React.MutableRefObject<Element | null>,
) => (action: refClassListReducerAction, className: string) => {
  if (ref.current) {
    if (action === 'add') {
      ref.current.classList.add(className);
    }
    if (action === 'remove') {
      ref.current.classList.remove(className);
    }
  }
};

function getBgColor(timesPlayed: number = 0) {
  if (timesPlayed > 200) return 'bg-blue-900 hover:bg-blue-900 text-white';
  if (timesPlayed > 100) return 'bg-blue-700 hover:bg-blue-800 text-white';
  if (timesPlayed > 50) return 'bg-blue-500 hover:bg-blue-600 text-white';
  if (timesPlayed > 20) return 'bg-blue-300 hover:bg-blue-400 text-blue-900';
  return 'bg-blue-100 hover:bg-blue-200 text-blue-900';
}

function SoundButton({ name, timesPlayed, onClick }: SoundButtonProps): JSX.Element {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const refClassList = refClassListReducer(buttonRef);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (!entry.isIntersecting) {
        entry.target.classList.remove('hoverOut');
      }
      if (entry.target instanceof HTMLButtonElement) {
        entry.target.style.setProperty('--shown', entry.isIntersecting ? '1' : '0');
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection);

    if (buttonRef.current) {
      observer.observe((buttonRef.current));
    }
  }, []);

  return (
    <button
      type="button"
      ref={buttonRef}
      className={`${getBgColor(timesPlayed)} text-bl font-bold py-2 px-4 rounded-full m-4 button`}
      onMouseDown={() => {
        refClassList('add', 'mouseDown');
        refClassList('remove', 'button');
        refClassList('remove', 'hoverOut');
      }}
      onMouseUp={() => {
        refClassList('add', 'button');
        refClassList('remove', 'mouseDown');
      }}
      onMouseOut={() => {
        refClassList('add', 'hoverOut');
        refClassList('remove', 'mouseDown');
      }}
      onBlur={() => {}}
      onClick={onClick}
    >
      {name}
    </button>
  );
}

export { SoundButton };
