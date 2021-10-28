import * as React from 'react';
import { XSound } from 'lebkuchen-fm-service';
import { queueXSound } from '../services/soundboard-service';
import SoundButton from './SoundButton';
import Search from './Search/Search';

function filterXSound(sound: XSound, phrase: string) {
  return sound.name.includes(phrase) || (sound.tags || []).some((tag) => tag.includes(phrase));
}

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
      <Search onPhraseChange={setFilterPhrase} />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {sounds.filter((s: XSound) => filterXSound(s, filterPhrase)).map(({ name, timesPlayed }) => (
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
