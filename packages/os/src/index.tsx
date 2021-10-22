import React from 'react';
import ReactDOM from 'react-dom';
import { openWindow } from './lebkuchen-kit/windowing';
import LebkuchenSprache from './apps/lebkuchen-sprache/LebkuchenSprache';
import boot from './lebkuchen-kit/boot';

boot();

const descriptor = openWindow({ title: 'test window' });

ReactDOM.render(
  <LebkuchenSprache />,
  descriptor.contentRootElement,
);
