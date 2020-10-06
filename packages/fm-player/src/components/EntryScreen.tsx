import * as React from 'react';
import App from './App';

function EntryScreen() {
  const [activated, setActivated] = React.useState<boolean>(false);

  return (
    <div>
      {activated && <App />}
      {!activated && (
        <button type="button" onClick={() => setActivated(true)}>Obudź Aldonkę!</button>
      )}
    </div>
  );
}

export default EntryScreen;
