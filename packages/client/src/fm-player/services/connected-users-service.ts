import mitt, { Emitter, Handler } from 'mitt';

const emitter: Emitter = mitt();

let connectedUsers: string[] = [];

function getUsers(): string[] {
  return [...connectedUsers];
}

function setUsers(users: string[]): void {
  connectedUsers = users;
  emitter.emit('change', connectedUsers);
}

function onUsersChange(callback: Handler<string[]>) {
  emitter.on<string[]>('change', callback);
}

export {
  getUsers,
  setUsers,
  onUsersChange,
};
