# LebkuchenFM
[![Actions Status](https://github.com/Deseteral/lebkuchen-fm/workflows/Build/badge.svg)](https://github.com/Deseteral/lebkuchen-fm/actions)

Monorepo for Lebkuchen FM project - _YouTube TV-like_ service with super powers controlled via Slack.

## Development
Start by installing dependencies:
```sh
npm install
```

You can run tests using
```sh
npm t
```

This project is separated into independent modules with main ones being `service` and `fm-player`.
For development information specific to modules refer to their _Development_ sections in this document.

It's recommended that you use [VS Code](https://code.visualstudio.com) with [ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for development.

### Type checking
Modules using TypeScript will compile even when there are type checking errors in the code. This allows for fast development iteration. Type checking is done during `test` script. For development it's recommended that you use type checker in watch mode using:
```sh
npm run test:type-check:watch
```

## Modules
This projects consists of these modules:

### Backend service
`/packages/service`\
Node service with MongoDB storage that communicates with clients over WebSockets and REST endpoints.

#### Configuration
- `PORT` - port on which the service will be running (automatically injected by cloud providers)
- `MONGODB_URI` - MongoDB connection string
- `DATABASE_NAME` - MongoDB database name (optional, defaults to `lebkuchen-fm`)
- `YOUTUBE_API_KEY` - YouTube Data API token
- `SLACK_CHANNEL_ID` - ID of Slack's channel on which the application will respond
- `COMMAND_PROMPT` - command prompt (optional, defaults to `/fm`)

#### Event stream
This service communicates with clients mostly using event stream implemented on WebSockets. For possible events check out [event data models](packages/service/src/event-stream/events.ts).

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

`GET /x-sounds` \
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
    },
    // ...
  ]
}
```

### FM player
`/packages/fm-player`\
Web client for the player. Communicates with the service via WebSocket event stream.

### Devops scripts
`/packages/service`\
Scripts related to maintenance of the service.

## License
This project is licensed under the [MIT license](LICENSE).
