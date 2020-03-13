import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import serverPush from './services/serverPush';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement,
);

const checkIoId = setInterval(() => {
  console.log('checking for socket.io');

  // @ts-ignore
  if (window.io) {
    serverPush.initSocket();
    clearInterval(checkIoId);
  }
}, 100);
