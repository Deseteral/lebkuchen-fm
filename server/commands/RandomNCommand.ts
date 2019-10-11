import CommandDefinition from '../domain/CommandDefinition';
import SongRepository from '../repositories/SongRepository';
import QueueEventMessage from '../domain/event-messages/QueueEventMessage';
import IoConnection from '../clients/IoConnection';
import SongService from '../services/SongService';

async function randomN(n: string) : Promise<string> {
  const parsedN: number = parseInt(n, 10);

  if (isNaN(parsedN) || (parsedN < 0 || parsedN > 50)) {
    return `Nieprawidłowa liczba utworów ${parsedN}, podaj liczbę z zakresu 0-50`;
  }

  const songList = await SongRepository.getAll();
  const shuffledSongList = [...songList].sort(() => 0.5 - Math.random());
  const selectedSongs = shuffledSongList.slice(0, parsedN);
  const titles: string[] = [];
  selectedSongs.forEach((song) => {
    const eventMessage: QueueEventMessage = { song };
    IoConnection.broadcast('queue', eventMessage);

    SongService.bumpPlayCount(song.youtubeId, song.name);
    titles.push(song.name);
  });
  const titlesToShow = titles.join('\n');

  return `Dodano do kolejki "${parsedN}" utworów: ${titlesToShow}`;
}

const commandDefinition: CommandDefinition = {
  key: 'randomN',
  process: randomN,
  helpMessage: 'Losuje n utworów z historii',
};

export default commandDefinition;
