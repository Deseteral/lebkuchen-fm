import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import './styles.css';
import { Desktop } from './views/Desktop/Desktop';
import { Login } from './views/Login/Login';

render(
  () => (
    <Router>
      {/* first route for local dev purpose */}
      <Route path="/" component={Desktop} />
      <Route path="/beta" component={Desktop} />
      <Route path="/login" component={Login} />
    </Router>
  ),
  document.getElementById('root')!,
);
