set -e

eval $(minikube -p minikube docker-env)

echo "Building and deploying the application"

source server/.env
minikube image build -t mb/app:0.1.0 .
helm dependency build deployment/movie-app
helm install app-deployment deployment/movie-app --values=deployment/values.yaml \
--set appValues.movie.apiToken=$MOVIE_API_TOKEN \
--set global.redis.password=$REDIS_PASSWORD
