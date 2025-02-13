# Configuration
LebkuchenFM uses environment variables for configuration.

You can also create `.env` file in the root of this project and put desired configuration variables in it.

## Service
Configuration necessary for the service to run.

| Name             | Description                | Default value               |
|------------------|----------------------------|-----------------------------|
| `MONGODB_URI`    | MongoDB connection string. | `mongodb://localhost:27017` |
| `COMMAND_PROMPT` | Command prompt.            | `/fm`                       |

## YouTube player
YouTube integration is optional - when required variables are not provided YouTube functionalities are not available.

| Name              | Description             | Required | Default value |
|-------------------|-------------------------|----------|---------------|
| `YOUTUBE_API_KEY` | YouTube Data API token. | Yes      | -             |

## Discord
Discord integration is optional - when required variables are not provided Discord communication is not available.
You can still issue commands using the [LebkuchenFM REST API](./rest_api.md).

| Name                 | Description                                                  | Required | Default value |
|----------------------|--------------------------------------------------------------|----------|---------------|
| `DISCORD_CHANNEL_ID` | ID of the Discord channel where the bot is allowed to run.   | Yes      | -             |
| `DISCORD_CLIENT_ID`  | Discord application ID.                                      | Yes      | -             |
| `DISCORD_GUILD_ID`   | ID of the Discord guild (server) where the bot will operate. | Yes      | -             |
| `DISCORD_TOKEN`      | Token of the Discord bot.                                    | Yes      | -             |

## Dropbox
Dropbox integration is optional - when required variables are not provided file storage functionalities are not
available.

Refer to [this guide][how_to_get_refresh_token] to get a refresh token.

| Name                    | Description                                                   | Required | Default value |
|-------------------------|---------------------------------------------------------------|----------|---------------|
| `DROPBOX_CLIENT_ID`     | Dropbox App Key.                                              | Yes      | -             |
| `DROPBOX_SECRET`        | Dropbox App Secret.                                           | Yes      | -             |
| `DROPBOX_REFRESH_TOKEN` | Dropbox refresh token.                                        | Yes      | -             |
| `DROPBOX_X_SOUNDS_PATH` | Directory path where the sounds will be saved inside Dropbox. | No       | `/xsounds/`   |

[how_to_get_refresh_token]: https://www.codemzy.com/blog/dropbox-long-lived-access-refresh-token#how-can-i-get-a-refresh-token-manually
