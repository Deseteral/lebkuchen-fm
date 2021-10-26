import * as React from 'react';
import { queueXSound } from '../services/soundboard-service';
import SoundButton from './SoundButton';

function SoundBoard() {
  const [sounds, setSounds] = React.useState([]);
  React.useEffect(() => {
    (async function fetchSounds() {
      const response = await fetch('/x-sounds');
      const data = await response.json();
      setSounds(data.sounds);
    }());
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
      {sounds.map(({ name, timesPlayed }) => (
        <SoundButton
          key={name}
          name={name}
          timesPlayed={timesPlayed}
          onClick={() => queueXSound(name)}
        />
      ))}
    </div>
  );
}

export default SoundBoard;
