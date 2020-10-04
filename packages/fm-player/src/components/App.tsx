import * as React from 'react';
import * as EventStreamClient from '../services/event-stream-client';

function App() {
  React.useEffect(() => {
    EventStreamClient.connect();
  }, []);

  return (
    <div>LebkuchenFM</div>
  );
}

export default App;
