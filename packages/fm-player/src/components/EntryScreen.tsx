import * as React from 'react';
import App from './App';
import Init from './Init';
import XSoundUploadForm from './XSoundUploadForm';

const screens = {
  ENTRY: 'ENTRY',
  PLAYER: 'PLAYER',
  UPLOAD: 'UPLOAD',
};

function EntryScreen() {
  const [screen, setScreen] = React.useState<String>(screens.ENTRY);

  return (
    <div>
      {screen === 'PLAYER' && <App />}
      {screen === 'ENTRY' && <Init action={setScreen} />}
      {screen === 'UPLOAD' && <XSoundUploadForm />}
    </div>
  );
}

export default EntryScreen;
