import * as React from 'react';
import { XSound } from 'lebkuchen-fm-service';
import { queueXSound } from '../services/soundboard-service';
import SoundButton from './SoundButton';
import Search from './Search/Search';

function soundMatchesPhrase(sound: XSound, phrase: string) {
  const { name, tags = [] } = sound;
  const tagsAndNameJoinedString = [name, ...tags].join(' ').toLowerCase();
  return phrase.toLowerCase().split(' ').every((keyword) => tagsAndNameJoinedString.includes(keyword));
}

function SoundBoard() {
  const [sounds, setSounds] = React.useState<XSound[]>([]);
  const [filteredSounds, setFilteredSounds] = React.useState<XSound[]>([]);
  const [filterPhrase, setFilterPhrase] = React.useState<string>('');

  React.useEffect(() => {
    (async function fetchSounds() {
      const response = await fetch('/x-sounds');
      const data = await response.json();
      setSounds(data.sounds);
      setFilteredSounds(data.sounds);
    }());
  }, []);

  const onPhraseChange = (phrase: string) => {
    setFilterPhrase(phrase);
    setFilteredSounds(sounds.filter((sound: XSound) => soundMatchesPhrase(sound, phrase)));
  };

  const handleSubmit = () => {
    const selectedSound = filteredSounds[0];
    if (selectedSound) queueXSound(selectedSound.name);
  };

  return (
    <div>
      <Search
        value={filterPhrase}
        onPhraseChange={onPhraseChange}
        onSubmit={handleSubmit}
        onEscape={() => onPhraseChange('')}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {filteredSounds.map(({ name, timesPlayed }) => (
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
