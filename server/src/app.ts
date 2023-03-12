import "dotenv/config";
import express from "express";
import { getConfig } from "./config";
import { join } from "path";
import { movieAPI } from "./movie-api";
import pinoHttp from "pino-http";

const { logger, appPort } = getConfig();

const app = express();

app.disable("x-powered-by");

app.use(
  pinoHttp({
    logger,
  })
);

app.use(express.static(join(__dirname, "../../public")));

app.get("/liveness", (_, res) => {
  res.sendStatus(200);
});

app.get("/readiness", (_, res) => {
  res.sendStatus(200);
});

app.use("/api", movieAPI);

app.get("/", (_, res) => {
  res.sendFile(join(__dirname, "../../frontend/www/index.html"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(<express.ErrorRequestHandler>((err, _, res, __) => {
  logger.error({ msg: err as Error });
  res.sendStatus(500);
}));

app.listen(appPort, () => {
  logger.info({ msg: "Application started" });
});
