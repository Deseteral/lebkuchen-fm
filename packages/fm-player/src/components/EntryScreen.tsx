import * as React from 'react';
import App from './App';
import SoundBoard from './SoundBoard';
import SplashScreen from './SplashScreen';
import XSoundUploadForm from './XSoundUploadForm';

export enum Screens {
  Splash,
  Player,
  Soundboard,
  Upload
}

function EntryScreen() {
  const [screen, setScreen] = React.useState<Screens>(Screens.Splash);

  return (
    <div>
      {screen === Screens.Player && <App />}
      {screen === Screens.Splash && <SplashScreen setScreen={setScreen} />}
      {screen === Screens.Upload && <XSoundUploadForm />}
      {screen === Screens.Soundboard && <SoundBoard />}
    </div>
  );
}
export default EntryScreen;
