import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId,
  name: string,
  password: UserPassword | null,
  session: UserSession | null,
  apiToken: string,
}

export interface UserPassword {
  hashedPassword: string,
  salt: string,
}

export interface UserSession {
  token: string,
  expires: Date,
}
