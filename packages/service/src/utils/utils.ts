import SocketIO from 'socket.io';

export function notNull<T>(value: T | null | undefined): value is T {
  return ((value !== null) && (value !== undefined));
}

export function expressMiddlewareToSocketIoMiddleware(expressMiddleware: Function) {
  return (socket: SocketIO.Socket, next: Function): Function => expressMiddleware(socket.request, {}, next);
}
