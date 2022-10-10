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
