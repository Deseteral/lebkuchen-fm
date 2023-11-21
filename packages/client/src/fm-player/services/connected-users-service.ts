import mitt, { Emitter, Handler } from 'mitt';

const emitter: Emitter = mitt();

let connectedUsers: string[] = [];

function getUsers(): readonly string[] {
  return [...connectedUsers] as const;
}

function setUsers(users: string[]): void {
  connectedUsers = users;
  emitter.emit('change', getUsers());
}

function onUsersChange(callback: Handler<string[]>) {
  emitter.on<string[]>('change', callback);
}

export {
  getUsers,
  setUsers,
  onUsersChange,
};
