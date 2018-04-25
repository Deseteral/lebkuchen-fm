# LebkuchenFM
[![Build Status](https://travis-ci.org/Deseteral/lebkuchen-fm.svg?branch=master)](https://travis-ci.org/Deseteral/lebkuchen-fm)

## Application configuration
You can configure the application using environment variables:

- `MONGO_URI` - MongoDB connection URI
- `YOUTUBE_KEY` - YouTube Data API key. Used to search on YouTube. Optional.

## Development
To run application in development mode you have to run both backend and frontend simultaneously.

```sh
npm run server:dev

# In another session
npm run frontend:dev
```

Backend server runs on port 9000 while frontend server runs on port 3000.
They're both able to communicate using proxy server that `frontend:dev` provides.

You also need to have MongoDB running on localhost.

## License
This project is licensed under the [MIT license](LICENSE).
