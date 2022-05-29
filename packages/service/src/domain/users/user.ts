import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId,
  name: string,
  password: UserPassword | null,

  // TODO: Add more data - creation date etc.
}

export interface UserPassword {
  hashedPassword: string,
  salt: string,
  apiToken: string,
}
