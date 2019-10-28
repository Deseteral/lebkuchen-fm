import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ConsoleExecutor from './executors/ConsoleExecutor';

// since speechSynthesis.speak() without user activation is no longer allowed
// executeFmCommand('speech', 'Cześć!') can be triggered from console for now
declare global {
    interface Window {
        executeFmCommand: Object;
    }
}
window.executeFmCommand = ConsoleExecutor.executeFmCommand;

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
