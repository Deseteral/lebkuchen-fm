import * as React from 'react';
import { useEffect, useRef } from 'react';
import './SoundButton.css';
import { queueXSound, playXSoundLocally } from '../service/soundboard-service';

interface SoundButtonProps {
  name: string,
  timesPlayed: number,
  url: string,
  isLocalMode: boolean
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

function getBgColor(isLocalMode: boolean, timesPlayed: number = 0) {
  const color = isLocalMode ? 'green' : 'blue';
  if (timesPlayed > 200) return `bg-${color}-900 hover:bg-${color}-900 text-white`;
  if (timesPlayed > 100) return `bg-${color}-700 hover:bg-${color}-800 text-white`;
  if (timesPlayed > 50) return `bg-${color}-500 hover:bg-${color}-600 text-white`;
  if (timesPlayed > 20) return `bg-${color}-300 hover:bg-${color}-400 text-${color}-900`;
  return `bg-${color}-100 hover:bg-${color}-200 text-${color}-900`;
}

function SoundButton({ name, timesPlayed, url, isLocalMode }: SoundButtonProps): JSX.Element {
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.metaKey || event.altKey) {
      playXSoundLocally(url);
    } else {
      queueXSound(name);
    }
  };

  return (
    <button
      type="button"
      ref={buttonRef}
      className={`${getBgColor(isLocalMode, timesPlayed)} text-bl font-bold py-2 px-4 rounded-full m-4 button`}
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
      onClick={handleClick}
    >
      {name}
    </button>
  );
}

export { SoundButton };
