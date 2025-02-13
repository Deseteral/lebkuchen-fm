# LebkuchenFM
[![Actions Status](https://github.com/Deseteral/lebkuchen-fm/workflows/Build/badge.svg)](https://github.com/Deseteral/lebkuchen-fm/actions)

## 🍿 Features
- Awesome desktop-like web UI.
- Play music from YouTube.
- Control the player via Discord commands.
- Synchronized music playback.
- Soundboard with custom sounds.
- Playback statistics.

## 📚 Documentation
- [Development](./docs/development.md)
- [Configuration](./docs/configuration.md)
- [Authorization and user management](./docs/auth.md)
- [Scripts](./docs/scripts.md)

## 🧑‍💻 Development
LebkuchenFM service is a Kotlin application that uses [Ktor](http://ktor.io) framework and Gradle for building.

The backbone of the service is MongoDB database. It is required for basic operation of the service.
The service communicates with clients over WebSockets and REST API.
It also hosts the web client.

LebkuchenFM's web client included with the service is a [SolidJS](https://www.solidjs.com) application that uses Vite for building.

For more information on building and working with the source refer to the [documentation](./docs/development.md).

## 📜 License
This project is licensed under the [MIT license](LICENSE).
