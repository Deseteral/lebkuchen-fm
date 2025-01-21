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
