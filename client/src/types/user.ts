interface User {
  username: string;
  discordId: string | null;
  creationDate: Date;
  lastLoggedIn: Date;
}

export { User };
