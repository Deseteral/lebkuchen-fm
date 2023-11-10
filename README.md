# LebkuchenFM
[![Actions Status](https://github.com/Deseteral/lebkuchen-fm/workflows/Build/badge.svg)](https://github.com/Deseteral/lebkuchen-fm/actions)

Monorepo for Lebkuchen FM project - opinionated _YouTube TV-like_ service with super powers controlled via Discord.

## Development
⚠️ **Please don't use npm to install dependencies**

Start by installing dependencies:
```sh
yarn install
```

To build application run:
```sh
yarn run build
```

You can run tests using:
```sh
yarn test
```

To clean up after previous builds before installing dependencies use:
```sh
yarn run clean:deps
```

To run the application you have to connect to MongoDB database.

If you have Docker installed you can use `./scripts/docker_db_local.sh` script to run MongoDB in Docker locally. For more information you can refer to [Local MongoDB in Docker](#Local-MongoDB-in-Docker) documentation section.

Then create `.env` file in the root of this project and put desired configuration variables in it (refer to [Service > Configuration](#Configuration) section of this document for available options).

When that's done you can just start the application:
```sh
yarn start
```

If you want to create local frontend dev server with hot reloading you should use "dev" script from `packages/client`:
```sh
yarn workspace lebkuchen-fm-client dev
```

This project is separated into backend service (`lebkuchen-fm-service` located in `packages/service`) and web client application (`lebkuchen-fm-client` located in `packages/client`).
For development information specific to modules refer to their _Development_ sections in this document. For more information about managing modules check out [yarn workspace docs](https://classic.yarnpkg.com/lang/en/docs/workspaces/).

### Type checking
Modules using TypeScript will compile even when there are type checking errors in the code. This allows for fast development iteration. Type checking is done during `test` script. For development it's recommended that you use type checker in watch mode:
```sh
yarn run test:type-check:watch
```

## Modules
This projects consists of these modules:

### Backend service (`/packages/service`)
Core LebkuchenFM Node.js service with MongoDB storage that communicates with clients over WebSockets and REST endpoints.

#### Configuration
Configure your instance via environment variables.
##### Service
- `MONGODB_URI` - MongoDB connection string
- `PORT` - port on which the service will be running (automatically injected by cloud providers)
- `LOCALE` - language of the service
- `COMMAND_PROMPT` - command prompt (optional, defaults to `/fm`)

##### Youtube player
- `YOUTUBE_API_KEY` - YouTube Data API token

##### Discord
- `DISCORD_CHANNEL_ID` - ID of the Discord channel where the bot is allowed to run
- `DISCORD_CLIENT_ID` - Discord application ID
- `DISCORD_GUILD_ID` - ID of the Discord guild (server) where the bot will operate
- `DISCORD_TOKEN` - token of the Discord bot

##### Dropbox - used for persisting files
- `DROPBOX_CLIENT_ID` - Dropbox App Key
- `DROPBOX_SECRET` - Dropbox App Secret
- `DROPBOX_REFRESH_TOKEN` - Dropbox [refresh token][how_to_get_refresh_token] used for persisting files

[how_to_get_refresh_token]: https://www.codemzy.com/blog/dropbox-long-lived-access-refresh-token#how-can-i-get-a-refresh-token-manually

#### Authorization
LebkuchenFM uses _session cookie_ and/or _basic auth with token_ methods to authorize it's users. Each request to `/api/*` endpoint has to be authorized.

Session cookie is set during successful `POST` request to `/api/auth` endpoint and is generally handled by the web client.

There is no way to register as a new user. Instead LebkuchenFM functions as an invite only system. \
When there are no registered users, first login is always correct and creates that account. Every next user has to be created using admin dashboard (`/admin`). That way a new account will be created and user is going be able to set the password when they login for the first time.

##### External integrations
For external integrations users should use API tokens.

Each user can obtain this token after logging in the web client and requesting `GET /api/auth` as mentioned in [REST endpoints](#REST-endpoints) section of this documentation.

Using this token external tools can integrate with LebkuchenFM by making requests with `Authorization: Basic <api-token>` header set.
Socket clients using socket.io can authorize by providing API token during connection like this:
```javascript
const socket = io({
  auth: {
    token: "api-token"
  }
});
```

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
      "tags": ["tag1", "tag2"],
      "timesPlayed": 6
    }
  ]
}
```

---

`GET /api/x-sounds?tag=example-tag` \
Returns a filtered list of XSounds containing given tag in the database.

**Response**
```json
{
  "sounds": [
    {
      "_id": "storage_id",
      "name": "example sound",
      "url": "https://example.com/example_sound.wav",
      "tags": ["example-tag"],
      "timesPlayed": 6
    }
  ]
}
```

---

`POST /api/x-sounds` \
Adds new sound file to XSounds database.

**Request** \
Requires content type to be `multipart/form-data` with fields:
- `soundName`: name of the sound to be added (like _"cool sound"_)
- `tags` (optional): comma separated list of tags (like _"tag1, tag2, tag3"_)
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

---

`GET /api/x-sounds/tags` \
Returns list of all unique XSounds tags in database.

**Response**
```json
{
  "tags": [
    "example tag",
    "another tag"
  ]
}
```

---

### Client (`/packages/client`)
Web client for the application. Communicates with the service via WebSocket event stream.

#### Development
Running `yarn run dev` runs the application in development mode with hot reload on file change. This version of application won't connect to the service.\
Running `yarn run build` builds the application in production mode.

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

Alternatively you can run it as an yarn command from the root of the project:
```
> yarn run fm "/fm resume"
> yarn run fm "/fm q dQw4w9WgXcQ"
> yarn run fm "/fm x alert"
```

#### Local MongoDB in Docker
Helper script `scripts/docker_db_local.sh` runs MongoDB and binds ports for local development.\
To stop container run `scripts/docker_db_local.sh stop`.

#### Docker Compose
You can also run this app via Docker Compose. It has MongoDB already configured. Just pass other necessary config variables.
```sh
docker compose up --build
```


## License
This project is licensed under the [MIT license](LICENSE).
