# LebkuchenFM
[![Build Status](https://travis-ci.org/Deseteral/lebkuchen-fm.svg?branch=master)](https://travis-ci.org/Deseteral/lebkuchen-fm)

## Application configuration
You can configure the application using environment variables:

- `SLACK_CHANNEL_ID` - Allowed Slack channel ID. Messages from other channels will be ignored.
- `MONGO_URI` - MongoDB connection URI.
- `YOUTUBE_KEY` - YouTube Data API key. Used to search on YouTube. Optional.

## Development
To run application in development mode you have to run both backend and frontend simultaneously.

```sh
npm run server:dev

# In another session
npm run frontend:dev
```

You also need to have MongoDB running on localhost.

## Scripts
Scripts related to the projects live in the `scripts` directory.

## License
This project is licensed under the [MIT license](LICENSE).
