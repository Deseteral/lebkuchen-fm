import React, { MouseEvent, useRef } from 'react';
import styles from './Window.module.css';

interface WindowProps {
  startPosition: {
    x: number,
    y: number
  },
  title: string,
  children: React.ReactElement
}

function Window({ startPosition, title, children }: WindowProps): React.JSX.Element {
  const windowRef = useRef<HTMLDivElement>(null);

  let nextX = 0;
  let nextY = 0;
  let { x } = startPosition;
  let { y } = startPosition;

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
      windowRef.current.style.zIndex = '1000';
    }
  };

  const dragMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    x = e.clientX;
    y = e.clientY;
    document.onmouseup = closeDragElement;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    document.onmousemove = elementDrag;
  };

  const onClose = () => {
    if (windowRef.current) {
      windowRef.current.style.display = 'none';
    }
  };

  return (
    <div
      className={styles.window}
      ref={windowRef}
      style={{ top: startPosition.y, left: startPosition.x }}
    >
      <div className={styles.title} onMouseDown={dragMouseDown}>
        {title}
        <button className={styles.close} onClick={onClose}>X</button>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}

export { Window };
