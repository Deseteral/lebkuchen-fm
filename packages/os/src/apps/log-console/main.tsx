import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../lebkuchen-kit/app';
import { openWindow } from '../../lebkuchen-kit/windowing';
import LogConsolePanel from './LogConsolePanel';

const definition: App = {
  name: 'Log console',
  main: () => {
    const descriptor = openWindow({ title: 'Log console' });

    ReactDOM.render(
      <LogConsolePanel />,
      descriptor.contentRootElement,
    );
  },
};

export default definition;
