# Demo app

## Prereqs

Obtain credentials to the movie API and create a .env file in the server folder. Fill in the required information.

Example:
```bash
MOVIE_API_TOKEN=<YOUR_CREDENTIALS>
MOVIE_API_URL=https://api.themoviedb.org
APP_PORT=4789
REDIS_PORT=6379
REDIS_HOST=localhost
REDIS_PASSWORD=
REDIS_USERNAME=
```

## Run without docker

1. Create a local Redis instance
2. Run the commands in the root folder
```bash
nvm install
npm install
npm run dev
```

## Run with docker

```bash
docker-compose up --force-recreate --no-deps --build
```