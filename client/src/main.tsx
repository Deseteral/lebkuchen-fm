import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import './styles.css';
import { Desktop } from './views/Desktop/Desktop';
import { Login } from './views/Login/Login';

render(
  () => (
    <Router>
      <Route path="/" component={Desktop} />
      <Route path="/login" component={Login} />
    </Router>
  ),
  document.getElementById('root')!,
);

// TODO: Remove 'events' package from dependencies once we get rid of the yt-player.
//       Right now the project will throw an error on startup without it.
//       See: https://github.com/feross/yt-player/issues/73
//       ~Deseteral, 2025-01-23
