import { RequestSession } from '@service/api/request-session';
import { IncomingMessage } from 'http';
import SocketIO from 'socket.io';

export function notNull<T>(value: T | null | undefined): value is T {
  return ((value !== null) && (value !== undefined));
}

export function expressMiddlewareToSocketIoMiddleware(expressMiddleware: Function) {
  return (socket: SocketIO.Socket, next: Function): Function => expressMiddleware(socket.request, {}, next);
}

export function parseAuthorizationHeader(authHeaderValue: string): (string | null) {
  const result = /^Basic (.+)$/.exec(authHeaderValue);
  const token = result && result[1];
  return token;
}

export function extractSessionFromIncomingMessage(incomingMessage: IncomingMessage): RequestSession {
  // @ts-ignore Trust me, there is session in message
  return incomingMessage.session;
}

export function parseToSeconds(time?: string): number | null {
  if (!time) {
    return null;
  }

  const splitedTime = time.split(':');
  if (!splitedTime.length || splitedTime.length > 3) {
    return null;
  }

  if (splitedTime.length === 1) {
    const seconds = parseInt(splitedTime[0], 10);
    return !Number.isNaN(seconds) ? seconds : null;
  }

  const timeParts = splitedTime.map((timePart) => parseInt(timePart, 10));
  const isValid = !timeParts.some((timePart) => Number.isNaN(timePart) || timePart > 60);

  if (!isValid) {
    return null;
  }

  return timeParts
    .reverse()
    .reduce((sum, timePart, index) => sum + timePart * (60 ** index), 0);
}
