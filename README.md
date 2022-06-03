# LebkuchenFM
[![Actions Status](https://github.com/Deseteral/lebkuchen-fm/workflows/Build/badge.svg)](https://github.com/Deseteral/lebkuchen-fm/actions)

Monorepo for Lebkuchen FM project - opinionated _YouTube TV-like_ service with super powers controlled via Slack.

## Development
Start by installing dependencies:
```sh
npm install
```

To build application run:
```sh
npm run build
```

You can run tests using:
```sh
npm test
```

To run the application you have to connect to MongoDB database.

If you have Docker installed you can use `./scripts/docker_db_local.sh` script to run MongoDB in Docker locally. For more information you can refer to [Local MongoDB in Docker](#Local-MongoDB-in-Docker) documentation section.

Then create `.env` file in the root of this project and put desired configuration variables in it (refer to [Service > Configuration](#Configuration) section of this document for available options).

When that's done you can just start the application:
```sh
npm start
```

This project is separated into backend service (`packages/service`) and web client application (`packages/client`).
For development information specific to modules refer to their _Development_ sections in this document.

It's recommended that you use [VS Code](https://code.visualstudio.com) with [ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for development.

### Type checking
Modules using TypeScript will compile even when there are type checking errors in the code. This allows for fast development iteration. Type checking is done during `test` script. For development it's recommended that you use type checker in watch mode:
```sh
npm run test:type-check:watch
```

## Modules
This projects consists of these modules:

### Backend service (`/packages/service`)
Core LebkuchenFM Node.js service with MongoDB storage that communicates with clients over WebSockets and REST endpoints.

#### Configuration
- `PORT` - port on which the service will be running (automatically injected by cloud providers)
- `DATABASE_NAME` - MongoDB database name (optional, defaults to `lebkuchen-fm`)
- `MONGODB_URI` - MongoDB connection string
- `YOUTUBE_API_KEY` - YouTube Data API token
- `SLACK_CHANNEL_ID` - ID of Slack's channel on which the application will respond (required if you use `/commands/slack` endpoint)
- `COMMAND_PROMPT` - command prompt (optional, defaults to `/fm`)
- `DROPBOX_TOKEN` - Dropbox API token used for persisting files
- `LOCALE` - language of the service

#### Development
Running `npm run dev` builds your code and runs the application. You have to setup MongoDB and environmental variables as described in [Development](#Development) section of this document to have fully functioning application.

#### Authorization
LebkuchenFM uses _session cookie_ and/or _basic auth with token_ methods to authorize it's users. Each request to `/api/*` endpoint has to be authorized.

Session cookie is set during successful `POST` request to `/api/auth` endpoint and is generally handled by the web client.

For external integrations users should use API tokens. Each user can obtain this token after logging in the web client and requesting `GET /api/auth` as mentioned in [REST endpoints](#REST-endpoints) section of this documentation. Using this token external tools can integrate with LebkuchenFM by making requests with `Authorization: Basic <api token>` header set.

There is no way to register as a new user. Instead LebkuchenFM functions as an invite only system. \
When there are no registered users, first login is always correct and creates that account. Every next user has to be created using admin dashboard (`/admin`). That way a new account will be created and user is going be able to set the password when they login for the first time.

#### Event stream
This service communicates with clients mostly using event stream implemented on WebSockets. For possible events check out [event data models](packages/service/src/event-stream/model/events.ts).

#### REST endpoints
`GET /api/auth` \
Information about currently logged in user.

**Response**
```json
{
  "username": "anton",
  "apiToken": "this_users_api_token"
}
```

---

`POST /api/auth/logout` \
Logs out currently logged in user.

---

`GET /api/history` \
History listing containing list of queued songs.

**Response**
```json
{
  "entries": [
    {
      "date": "2022-05-31T12:46:17.968Z",
      "youtubeId": "c6pPAso-y8s"
    }
  ]
}
```

---

`POST /api/commands/slack` \
Slash commands interface for Slack. Read [Slack API docs](https://api.slack.com/interactivity/slash-commands) for more information.

---

`GET /api/songs` \
Returns list of all songs in the database sorted by play count (descending).

**Response**
```json
{
  "songs": [
    {
      "_id": "storage_id",
      "name": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "timesPlayed": 1337
    }
  ]
}
```

---

`POST /api/commands/text` \
Plain text interface for slash commands.

**Body**
```json
{
  "text": "/fm help"
}
```

**Response**
```json
{
  "textResponse": "Command response in plain text format"
}
```

---

`GET /api/users` \
List of all registered users.

**Response**
```json
{
  "users": [
    {
      "name": "anton",
      "creationDate": "2022-05-31T19:59:05.879Z",
      "lastLoggedIn": "2022-05-31T20:01:17.072Z"
    }
  ]
}
```

---

`GET /api/x-sounds` \
Returns list of all XSounds in the database.

**Response**
```json
{
  "sounds": [
    {
      "_id": "storage_id",
      "name": "example sound",
      "url": "https://example.com/example_sound.wav",
      "timesPlayed": 6
    }
  ]
}
```

---

`POST /api/x-sounds` \
Adds new sound file to X Sounds database.

**Request** \
Requires content type to be `multipart/form-data` with fields:
- `soundName`: name of the sound to be added (like _"bruh"_)
- `soundFile`: sound [File](https://developer.mozilla.org/en-US/docs/Web/API/File) ideally in mp3 or wav format

**Response**
```json
{
  "_id": "storage_id",
  "name": "my new sound",
  "url": "https://example.com/example_sound.wav",
  "timesPlayed": 0
}
```

### Client (`/packages/client`)
Web client for the application. Communicates with the service via WebSocket event stream.

#### Development
Running `npm run dev` runs the application in development mode with hot reload on file change. This version of application won't connect to the service.\
Running `npm run build` builds the application in production mode.

### Devops scripts (`/scripts`)
Scripts related to maintenance of the service.

#### FM Dev Helper
Helper script `scripts/fm.sh` is available for local development purposes. By default it sends a command to a local development server.

Example commands:
```
> fm.sh "/fm resume"
> fm.sh "/fm q dQw4w9WgXcQ"
> fm.sh "/fm x alert"
```

Alternatively you can run it as an npm command from the root of the project:
```
> npm run fm -- "/fm resume"
> npm run fm -- "/fm q dQw4w9WgXcQ"
> npm run fm -- "/fm x alert"
```

#### Local MongoDB in Docker
Helper script `scripts/docker_db_local.sh` runs MongoDB and binds ports for local development.\
To stop container run `scripts/docker_db_local.sh stop`.

## License
This project is licensed under the [MIT license](LICENSE).
