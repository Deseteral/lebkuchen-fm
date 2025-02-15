# Scripts
Scripts related to maintenance of the service are located in the `scripts` directory.

## Set version
Helper script `scripts/set_version.sh` sets the version both in Gradle and npm files.

Usage:
```sh
scripts/set_version.sh "2025.1.2"
```

## FM command helper
Helper script `scripts/fm.sh` is available for local development purposes. By default, it sends a command to a local development server.

Example commands:
```
$ scripts/fm.sh "/fm resume" "user-api-token"
$ scripts/fm.sh "/fm q dQw4w9WgXcQ" "user-api-token"
$ scripts/fm.sh "/fm x alert" "user-api-token"
```

## Local MongoDB in Docker
Helper script `scripts/docker_db_local.sh` runs MongoDB and binds ports for local development.\
To stop container run `scripts/docker_db_local.sh stop`.

## Data backup
There are two scripts meant to help you with data backup.

- `scripts/backup_database.sh` creates a zip file with the dump of the database.
- `scripts/download_xsounds.sh` creates a zip file with all sounds from the file storage.

Invoke scripts without any arguments to get more information about their usage.

## Docker Compose
You can also run this app via Docker Compose. It has MongoDB already configured. Just pass other necessary config variables.
```sh
docker compose up --build
```
