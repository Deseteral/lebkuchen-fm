# Configuration

LebkuchenFM requires only two environment variables to run.

Integration settings are stored encrypted in MongoDB and editable via the
`PATCH /api/integrations` endpoint (Content-Type: `application/merge-patch+json`).
Only users with the **Integrations Manage** scope (`integrations:manage`) can
read or modify integration configuration.

## Environment variables

| Name                    | Description                                                       | Default value               |
|-------------------------|-------------------------------------------------------------------|-----------------------------|
| `MONGODB_URI`           | MongoDB connection string.                                        | `mongodb://localhost:27017` |
| `SECRET_ENCRYPTION_KEY` | Cryptographically random 256-bit key for secure secrets storage.  | —                           |
| `PORT`                  | OPTIONAL: Port the service listens on.                            | `8080`                      |

### Generating `SECRET_ENCRYPTION_KEY`

Generate a cryptographically random 256-bit key:

```sh
openssl rand -base64 32
```

Store the resulting string in the `SECRET_ENCRYPTION_KEY` environment variable.

**Key backup and recovery:** The encryption key is used to encrypt all integration secrets
(API keys, tokens) at rest in MongoDB. If the key is lost, those secrets cannot be decrypted
and the integrations will stop working. Always back up the key in a secure location such as
a password manager, secret vault (e.g. HashiCorp Vault), or encrypted file.

For hardened deployments you can use [Docker secrets](https://docs.docker.com/engine/swarm/secrets/)
instead of a plaintext environment variable.

## Backward compatibility with env variables

On first startup, if no integration configuration exists in the database yet, the service
will seed values from legacy environment variables (if present) and log deprecation
warnings. After that initial seed, legacy env vars are ignored entirely and can be removed
from your environment.

### YouTube

| Setting   | Legacy env var     | Description              |
|-----------|--------------------|--------------------------|
| API Key   | `YOUTUBE_API_KEY`  | YouTube Data API v3 key. |

### Discord

| Setting        | Legacy env var       | Description                                                   |
|----------------|----------------------|---------------------------------------------------------------|
| Token          | `DISCORD_TOKEN`      | Discord bot token.                                            |
| Channel ID     | `DISCORD_CHANNEL_ID` | ID of the Discord channel where the bot listens for commands. |
| Command Prompt | `COMMAND_PROMPT`     | Prefix that triggers bot commands (defaults to `/fm`).        |

### Dropbox

| Setting        | Legacy env var          | Description                                                              |
|----------------|-------------------------|--------------------------------------------------------------------------|
| App Key        | `DROPBOX_CLIENT_ID`     | Dropbox application key.                                                 |
| App Secret     | `DROPBOX_SECRET`        | Dropbox application secret.                                              |
| Refresh Token  | `DROPBOX_REFRESH_TOKEN` | Long-lived refresh token. See [this guide][how_to_get_refresh_token].    |
| Sounds Path    | `DROPBOX_X_SOUNDS_PATH` | Directory in Dropbox where x-sounds are stored (defaults to `/xsounds/`).|

[how_to_get_refresh_token]: https://www.codemzy.com/blog/dropbox-long-lived-access-refresh-token#how-can-i-get-a-refresh-token-manually
