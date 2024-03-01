import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { Soundboard } from './apps/Soundboard/Soundboard';

function Desktop() {
  // React.useEffect(() => {
  // checkLoginStateAndRedirect();
  // }, []);

  return (
    <main className="desktop">
      <Soundboard />
      <Soundboard />
      <Soundboard />
      <Soundboard />
    </main>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<Desktop />);
