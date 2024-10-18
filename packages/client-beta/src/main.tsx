import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import './styles.css';
import { Desktop } from './views/Desktop/Desktop';

render(
  () => (
    <Router>
      {/* first route for local dev purpose */}
      <Route path="/" component={Desktop} />
      <Route path="/beta" component={Desktop} />
    </Router>
  ),
  document.getElementById('root')!,
);
