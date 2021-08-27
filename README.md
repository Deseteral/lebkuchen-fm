# LebkuchenFM
[![Actions Status](https://github.com/Deseteral/lebkuchen-fm/workflows/Build/badge.svg)](https://github.com/Deseteral/lebkuchen-fm/actions)

Monorepo for Lebkuchen FM project - _YouTube TV-like_ service with super powers controlled via Slack.

## Development
Start by installing dependencies:
```sh
npm install
```

You can run tests using:
```sh
npm test
```

To build application run
```sh
npm run build
```

To run the application locally you have to have MongoDB installed and running on localhost. For information on how to do that head over to [MongoDB documentation](https://docs.mongodb.com/manual/administration/install-community).\
Then create `.env` file in the root of this project and put YouTube Data API key in it (required if you want to use YouTube features):
```
YOUTUBE_API_KEY=<your-youtube-data-api-key>
```

When that's done you can just start the application:
```sh
npm start
```

This project is separated into independent modules with main ones being `service` and `fm-player`.
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
- `MONGODB_URI` - MongoDB connection string
- `DATABASE_NAME` - MongoDB database name (optional, defaults to `lebkuchen-fm`)
- `YOUTUBE_API_KEY` - YouTube Data API token
- `SLACK_CHANNEL_ID` - ID of Slack's channel on which the application will respond (required if you use `/commands/slack` endpoint)
- `COMMAND_PROMPT` - command prompt (optional, defaults to `/fm`)

#### Development
Running `npm run dev` builds your code and runs the application. You have to setup MongoDB and environmental variables as described in [#Development](#Development) section of this document to have fully functioning application.

#### Event stream
This service communicates with clients mostly using event stream implemented on WebSockets. For possible events check out [event data models](packages/service/src/event-stream/model/events.ts).

#### REST endpoints
`POST /commands/slack` \
Slash commands interface for Slack. Read [Slack API docs](https://api.slack.com/interactivity/slash-commands) for more information.

---

`POST /commands/text` \
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

`GET /songs` \
Returns list of all songs in the database sorted by play count (descending).

**Response**
```jsonc
{
  "songs": [
    {
      "_id": "storage_id",
      "name": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "timesPlayed": 1337
    },
    // ...
  ]
}
```

---

`GET /x-sounds` \
Returns list of all XSounds in the database.

**Response**
```jsonc
{
  "sounds": [
    {
      "_id": "storage_id",
      "name": "example sound",
      "url": "https://example.com/example_sound.wav",
      "timesPlayed": 6
    },
    // ...
  ]
}
```

### FM player (`/packages/fm-player`)
Web client for the player. Communicates with the service via WebSocket event stream.

#### Development
Running `npm run dev` runs the application in development mode with hot reload on file change. This version of application won't connect to the service.

Running `npm run build` builds the application in production mode.

### Devops scripts (`/packages/devops`)
Scripts related to maintenance of the service.

## License
This project is licensed under the [MIT license](LICENSE).
