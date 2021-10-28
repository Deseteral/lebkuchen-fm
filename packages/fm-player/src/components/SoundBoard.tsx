import * as React from 'react';
import { queueXSound, XSound } from '../services/soundboard-service';
import SoundButton from './SoundButton';

function SoundBoard() {
  const [sounds, setSounds] = React.useState([]);
  const [filterPhrase, setFilterPhrase] = React.useState('');
  React.useEffect(() => {
    (async function fetchSounds() {
      const response = await fetch('/x-sounds');
      const data = await response.json();
      setSounds(data.sounds);
    }());
  }, []);

  return (
    <div>
      <div className="relative p-4">
        <input
          type="search"
          className="bg-purple-white shadow rounded border-0 p-3 w-6/12"
          placeholder="Filter sounds..."
          onChange={(e) => setFilterPhrase(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {sounds.filter((s: XSound) => s.name.includes(filterPhrase)).map(({ name, timesPlayed }) => (
          <SoundButton
            key={name}
            name={name}
            timesPlayed={timesPlayed}
            onClick={() => queueXSound(name)}
          />
        ))}
      </div>
    </div>

  );
}

export default SoundBoard;
