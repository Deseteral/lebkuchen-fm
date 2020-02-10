# LebkuchenFM
[![Actions Status](https://github.com/Deseteral/lebkuchen-fm/workflows/Build/badge.svg)](https://github.com/Deseteral/lebkuchen-fm/actions)

## Configuration
### Backend service
- `PORT` - port on which the service will be running (automatically injected by Heroku)
- `MONGODB_URI` - MongoDB connection string
- `SLACK_CHANNEL_ID` - ID of Slack's channel on which the application will respond
- `YOUTUBE_DATA_API_TOKEN` - YouTube Data API token
- `COMMAND_PROMPT` - command prompt (optional, default is `/fm`)

## API
### Data models
```typescript
interface XSound {
    name: string,
    url: string,
    playCount: number,
}
```

### Endpoints
`GET /xsounds` \
Returns list of all sounds
```typescript
interface XSoundsDTO {
    sounds: Array<XSound>,
}
```

## Scripts
Scripts related to the project live in the `scripts` directory.

## License
This project is licensed under the [MIT license](LICENSE).
