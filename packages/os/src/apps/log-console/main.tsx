import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../lebkuchen-kit/app';
import { openWindow } from '../../lebkuchen-kit/windowing';
import LogConsolePanel from './LogConsolePanel';

const definition: App = {
  name: 'Log console',
  icon: '🛠',
  main: (appDefinition: App) => {
    const descriptor = openWindow({
      title: appDefinition.name,
      icon: appDefinition.icon,
      size: [400, 200],
    });

    ReactDOM.render(
      <LogConsolePanel />,
      descriptor.contentRootElement,
    );
  },
};

export default definition;
