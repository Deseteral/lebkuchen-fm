# Service

## Building
LebkuchenFM service uses Gradle for its build system.\
Refer to [Ktor documentation](https://ktor.io/docs) for detailed building instruction and how to import the project in the IDE of your choice.

## Running locally

### Configuration
LebkuchenFM is configured via environment variables.
Refer to [configuration](./configuration.md) documentation for available configuration variables.

We recommend using `.env` file to store configuration variables for local development.
You can use IntelliJ's plugin to source it, or load the variables in the command line shell of your choice.

### MongoDB
To run the application locally you will have to connect it to a MongoDB instance.

You can provide connection string via environment variable.
Refer to documentation about [configuration](./configuration.md) for more details.

If none is provided, the service will connect to MongoDB instance running locally.

If you have Docker installed you can use `scripts/docker_db_local.sh` script to run MongoDB in Docker locally.
For more information you can refer to [Local MongoDB in Docker](./scripts.md) script documentation.


# Web client
LebkuchenFM web client uses Vite for its build system, and Yarn for package management.

Start by installing dependencies:
```sh
yarn install
```

## Running locally
For development purposes you should use Vite's development server:
```sh
yarn run dev
```

This will start a development server on `localhost:9090` with hot-reloading enabled and a proxy to the backend service running on `localhost:8080`.

## Building
To build a production bundle run:
```sh
yarn run build
```

You can run tests using:
```sh
yarn test
```
Tests include linting and checking code style (using Prettier).
