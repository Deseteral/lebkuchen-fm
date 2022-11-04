import React from 'react';

interface KeyStrokeConfig {
  altKey?: boolean,
  ctrlKey?: boolean,
  shiftKey?: boolean,
  metaKey?: boolean,
  key: string,
}

const useKeyStroke = (keyStroke: KeyStrokeConfig, callback: () => void) => {
  React.useEffect(() => {
    const keyDownHandle = (keyEvent: KeyboardEvent) => {
      if (
        keyEvent.key === keyStroke.key &&
        keyEvent.altKey === !!keyStroke.altKey &&
        keyEvent.ctrlKey === !!keyStroke.ctrlKey &&
        keyEvent.shiftKey === !!keyStroke.shiftKey &&
        keyEvent.metaKey === !!keyStroke.metaKey &&
        callback) callback();
    };

    window.addEventListener('keydown', keyDownHandle);
    return () => {
      window.removeEventListener('keydown', keyDownHandle);
    };
  }, [callback, keyStroke]);
};

export { useKeyStroke };
