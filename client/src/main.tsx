import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import '@phosphor-icons/web/bold';
import '@phosphor-icons/web/fill';
import { Main } from './views/Main/Main';
import { Login } from './views/Login/Login';
import './utils';
import './styles.css';
import './biurko.css';

console.log(
  `%cLebkuchenFM v${__APP_VERSION__}`,
  'font-weight: bold; font-size: 42px; font-style: italic; color: #6261A1;',
);

render(
  () => (
    <Router>
      <Route path="/" component={Main} />
      <Route path="/login" component={Login} />
    </Router>
  ),
  document.getElementById('root')!,
);
