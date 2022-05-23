import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId,
  name: string,
  password: UserPassword | null,
}

export interface UserPassword {
  hashedPassword: string,
  salt: string,
}
