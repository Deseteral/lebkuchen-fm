import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import './styles.css';
import { Desktop } from './views/Desktop/Desktop';
import { Login } from './views/Login/Login';

console.log(
  `%cLebkuchenFM v${__APP_VERSION__}`,
  `font-weight: bold; font-size: 42px; font-style: italic; color: #6261A1;`,
);

render(
  () => (
    <Router>
      <Route path="/" component={Desktop} />
      <Route path="/login" component={Login} />
    </Router>
  ),
  document.getElementById('root')!,
);
