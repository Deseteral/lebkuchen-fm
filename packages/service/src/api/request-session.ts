export interface RequestSession {
  loggedUser: (LoggedUserSession | null),
}

export interface LoggedUserSession {
  name: string,
  apiToken: string,
}
