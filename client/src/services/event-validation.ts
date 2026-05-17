import type { EventData } from '../types/event-data';

const KNOWN_EVENT_IDS: Set<EventData['id']> = new Set([
  'PlayerStateUpdateEvent',
  'PlayerStateRequestDonationEvent',
  'PlayerStateRequestEvent',
  'PlayerStateDonationEvent',
  'AddSongsToQueueEvent',
  'PlayXSoundEvent',
  'SayEvent',
  'PauseEvent',
  'ResumeEvent',
  'SkipEvent',
  'ChangeSpeedEvent',
  'ChangeVolumeEvent',
  'ReplaceQueueEvent',
  'RewindEvent',
  'ConnectedUsersEvent',
  'SongChanged',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || isString(value);
}

function isKnownEventId(id: unknown): id is EventData['id'] {
  return isString(id) && KNOWN_EVENT_IDS.has(id as EventData['id']);
}

function isValidEventData(value: unknown): value is EventData {
  if (!isRecord(value) || !isKnownEventId(value.id)) return false;

  switch (value.id) {
    case 'PlayerStateRequestEvent':
    case 'PauseEvent':
    case 'ResumeEvent':
      return isOptionalString(value.actorName);

    case 'PlayerStateRequestDonationEvent':
      return isString(value.requestHandle);

    case 'PlayerStateUpdateEvent':
      return isRecord(value.state);

    case 'PlayerStateDonationEvent':
      return isString(value.requestHandle) && isRecord(value.state);

    case 'AddSongsToQueueEvent':
      return Array.isArray(value.songs) && isOptionalString(value.actorName);

    case 'PlayXSoundEvent':
      return (
        isString(value.soundUrl) &&
        isOptionalString(value.soundName) &&
        isOptionalString(value.actorName)
      );

    case 'SayEvent':
      return isString(value.text);

    case 'SkipEvent':
      return (
        isBoolean(value.skipAll) && isNumber(value.amount) && isOptionalString(value.actorName)
      );

    case 'ChangeSpeedEvent':
      return value.nextSpeed === -1 || value.nextSpeed === 0 || value.nextSpeed === 1;

    case 'ChangeVolumeEvent':
      return isBoolean(value.isRelative) && isNumber(value.nextVolume);

    case 'ReplaceQueueEvent':
      return Array.isArray(value.songs);

    case 'RewindEvent':
      return isNumber(value.time) && (value.modifier === null || isNumber(value.modifier));

    case 'ConnectedUsersEvent':
      return Array.isArray(value.connectedUsers) && value.connectedUsers.every(isString);

    case 'SongChanged':
      return isRecord(value.song);

    default:
      return false;
  }
}

export { isRecord, isString, isKnownEventId, isValidEventData };
