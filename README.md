# Demo app

## Prereqs

Obtain credentials to the movie API and create a .env file in the server folder. Fill in the required information.

Example:
```bash
MOVIE_API_TOKEN=<YOUR_CREDENTIALS>
MOVIE_API_URL=https://api.themoviedb.org
MOVIE_API_POSTER_URL=https://image.tmdb.org/t/p/original
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

## Run with minikube

1. Install minikube on your system, for mac:
```bash
brew install kubectl
brew install minikube
```
2. Start minikube and start the cluster
```bash
minikube start
```
3. Run the deploy script. If you haven't already given a password to your redis server then bitnami chart will
autogenerate one and you wont be able to connect.
```bash
./deploy-minikube.sh
```
1. Wait until the redis stateful set bootstraps

Access the service by running
```bash
minikube service app-deployment-movie-app
```

## Troubleshooting

Be mindful that if you ran the minikube docker-env command you won't be able to use docker compose in the same terminal.
