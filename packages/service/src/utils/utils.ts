import { RequestSession } from '@service/api/request-session';
import { Session } from 'express-session';
import SocketIO from 'socket.io';

declare module 'http' {
  interface IncomingMessage {
    session: Session & RequestSession,
  }
}

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
