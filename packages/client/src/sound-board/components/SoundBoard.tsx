import * as React from 'react';
import { XSound } from 'lebkuchen-fm-service';
import { playXSoundLocally, queueXSound } from '../service/soundboard-service';
import { SoundButton } from './SoundButton';
import { Search } from './Search';

function soundMatchesPhrase(sound: XSound, phrase: string) {
  const { name, tags = [] } = sound;
  const tagsAndNameJoinedString = [name, ...tags].join(' ').toLowerCase();
  return phrase.toLowerCase().split(' ').every((keyword) => tagsAndNameJoinedString.includes(keyword));
}

function SoundBoard() {
  const [sounds, setSounds] = React.useState<XSound[]>([]);
  const [filteredSounds, setFilteredSounds] = React.useState<XSound[]>([]);
  const [filterPhrase, setFilterPhrase] = React.useState<string>('');
  const [isLocalMode, setIsLocalMode] = React.useState(false);

  React.useEffect(() => {
    (async function fetchSounds() {
      const response = await fetch('/api/x-sounds');
      const data = await response.json();
      setSounds(data.sounds);
      setFilteredSounds(data.sounds);
    }());

    const keyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.altKey) {
        setIsLocalMode(true);
      }
    };
    const keyUp = () => setIsLocalMode(false);

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    return () => {
      document.removeEventListener('keydown', keyDown);
      document.addEventListener('keyup', keyUp);
    };
  }, []);

  const onPhraseChange = (phrase: string) => {
    setFilterPhrase(phrase);
    setFilteredSounds(sounds.filter((sound: XSound) => soundMatchesPhrase(sound, phrase)));
  };

  const handleSubmit = (event: React.KeyboardEvent) => {
    const selectedSound = filteredSounds[0];
    if (selectedSound) {
      if (event.metaKey || event.altKey) {
        playXSoundLocally(selectedSound.url);
      } else {
        queueXSound(selectedSound.name);
      }
    }
  };

  return (
    <div>
      <Search
        value={filterPhrase}
        onPhraseChange={onPhraseChange}
        onSubmit={handleSubmit}
        onEscape={() => onPhraseChange('')}
      />
      {sounds.length > 1 && (
        <div
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
        >
          {filteredSounds.map(({ name, timesPlayed, url }) => (
            <SoundButton
              isLocalMode={isLocalMode}
              key={name}
              name={name}
              url={url}
              timesPlayed={timesPlayed}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { SoundBoard };
