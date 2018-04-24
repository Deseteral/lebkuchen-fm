function parseToSeconds(text: string) : (number | null) {
  const [minutes, seconds] = text.split(':');

  if (!minutes || !seconds) return null;

  const parsedMinutes = parseInt(minutes, 10);
  const parsedSeconds = parseInt(seconds, 10);

  if (isNaN(parsedMinutes) || isNaN(parsedSeconds)) return null;

  return ((parsedMinutes * 60) + parsedSeconds);
}

export default {
  parseToSeconds,
};
