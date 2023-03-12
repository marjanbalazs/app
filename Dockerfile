FROM node:18.14-alpine as build
WORKDIR /build
COPY . .
RUN npm i
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /build/public ./public
COPY --from=build /build/server/build/app.js ./server/run/app.js
COPY --from=build /build/server/views ./views
CMD ["node", "./server/run/app.js"]