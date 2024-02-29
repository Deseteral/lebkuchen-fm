import React from 'react';
import { createRoot } from 'react-dom/client';
import { Window } from './components/Window/Window';
import './styles.css';

function App() {
  // React.useEffect(() => {
  // checkLoginStateAndRedirect();
  // }, []);

  return (
    <main>
      <Window startPosition={{ x: 50, y: 50 }} title="LebkuchenFM">
        <h1>Player</h1>
      </Window>
      <Window startPosition={{ x: 400, y: 250 }} title="LebkuchenFM Soundboard">
        <h1>Soundboard</h1>
      </Window>
    </main>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
