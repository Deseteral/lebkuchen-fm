import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId,
  data: UserData,
  secret: (UserSecret | null),
}

export interface UserData {
  name: string,
  // TODO: Add more data - creation date etc.
}

export interface UserSecret {
  hashedPassword: string,
  salt: string,
  apiToken: string,
}
