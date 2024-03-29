import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId,
  data: UserData,
  secret: (UserSecret | null),
}

export interface UserData {
  name: string,
  discordId: (string | null),
  creationDate: Date,
  lastLoggedIn: Date,
}

export interface UserSecret {
  hashedPassword: string,
  salt: string,
  apiToken: string,
}
