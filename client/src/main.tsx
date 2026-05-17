import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import { ErrorBoundary } from 'solid-js';
import '@phosphor-icons/web/bold';
import '@phosphor-icons/web/fill';
import { Desktop } from './views/Desktop/Desktop';
import { Login } from './views/Login/Login';
import { FatalErrorScreen } from '@components/FatalErrorScreen/FatalErrorScreen';
import { reportClientError } from './services/client-error-reporting';
import './utils';
import './styles.css';

console.log(
  `%cLebkuchenFM v${__APP_VERSION__}`,
  'font-weight: bold; font-size: 42px; font-style: italic; color: #6261A1;',
);

window.addEventListener('error', (event) => {
  reportClientError('window.error', event.error ?? event.message, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  reportClientError('window.unhandledrejection', event.reason);
});

render(
  () => (
    <ErrorBoundary
      fallback={(error) => {
        reportClientError('error-boundary', error);
        return <FatalErrorScreen />;
      }}
    >
      <Router>
        <Route path="/" component={Desktop} />
        <Route path="/login" component={Login} />
      </Router>
    </ErrorBoundary>
  ),
  document.getElementById('root')!,
);
