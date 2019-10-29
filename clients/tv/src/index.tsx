import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ConsoleExecutor from './executors/ConsoleExecutor';

// since speechSynthesis.speak() without user activation is no longer allowed
// executeFmCommand('speech', 'Cześć!') can be triggered from console for now
// @ts-ignore
window.executeFmCommand = ConsoleExecutor.executeFmCommand;

ReactDOM.render(<App />, document.getElementById('root'));
