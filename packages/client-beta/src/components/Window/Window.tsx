import React, { MouseEvent, ReactPortal, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Window.module.css';
import { useWindowsContext } from '../../common/windows-context';

interface WindowProps {
  children: React.ReactElement | React.ReactElement[];
  startPosition: {
    x: number;
    y: number;
  };
  title: string;
  close: () => void;
}

function Window({ startPosition, title, close, children }: WindowProps): ReactPortal {
  const { windows, cleanWindow } = useWindowsContext();
  const windowRef = useRef<HTMLDivElement>(null);
  const UUIDRef = useRef(crypto.randomUUID());

  let { x, y } = startPosition;
  let nextX = 0;
  let nextY = 0;

  useEffect(() => {
    const UUID = UUIDRef.current;
    windows.push({
      id: UUID,
      ref: windowRef,
    });

    return () => cleanWindow(UUID);
  }, [windows, cleanWindow]);

  const moveWindowToFront = () => {
    if (windowRef.current) {
      const parent = windowRef.current.parentNode;
      parent?.removeChild(windowRef.current);
      parent?.appendChild(windowRef.current);
    }
  };

  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  };

  const elementDrag = (e: MouseEvent) => {
    e.preventDefault();
    nextX = x - e.clientX;
    nextY = y - e.clientY;
    x = e.clientX;
    y = e.clientY;
    if (windowRef.current) {
      windowRef.current.style.top = `${windowRef.current.offsetTop - nextY}px`;
      windowRef.current.style.left = `${windowRef.current.offsetLeft - nextX}px`;
    }
  };

  const dragMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    moveWindowToFront();
    x = e.clientX;
    y = e.clientY;
    document.onmouseup = closeDragElement;
    // @ts-ignore
    document.onmousemove = elementDrag;
  };

  const closeWindow = (e: React.MouseEvent) => {
    e.stopPropagation();
    close();
  };

  // @ts-ignore
  return createPortal(
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={styles.window}
      ref={windowRef}
      onClick={moveWindowToFront}
      style={{ top: startPosition.y, left: startPosition.x }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className={styles.title} onMouseDown={dragMouseDown}>
        <p>{title}</p>
        <button type="button" className={styles.close} onMouseDown={closeWindow}>
          X
        </button>
      </div>
      <div className={styles.content}>{children}</div>
    </div>,
    document.getElementById('windows')!,
  );
}

export { Window };
