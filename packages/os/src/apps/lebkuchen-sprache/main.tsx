import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../lebkuchen-kit/app';
import { openWindow } from '../../lebkuchen-kit/windowing';
import LebkuchenSprache from './LebkuchenSprache';

const definition: App = {
  name: 'Lebkuchen Sprache',
  icon: '📫',
  main: (appDefinition: App) => {
    const descriptor = openWindow({ title: appDefinition.name, icon: appDefinition.icon });

    ReactDOM.render(
      <LebkuchenSprache />,
      descriptor.contentRootElement,
    );
  },
};

export default definition;
