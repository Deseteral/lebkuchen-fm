import * as React from 'react';

function QueueList({ queue }) {
  const verticalQueue = queue.slice(0, 9);
  const horizontalQueue = queue.slice(9, 17);
  return (
    <div>
      <div className="queue-container">
        <ul className="queue">
          {verticalQueue.map(printTitle)}
        </ul>
      </div>
      <div className="dashboard-container">
        <ul className="queue">
          {horizontalQueue.map(printTitle)}
        </ul>
      </div>
    </div>
  );
}

function printTitle(title) {
  return (<li className="queue-item">{title.name ? title.name : 'Niespodzianka'}</li>);
}

export default QueueList;
