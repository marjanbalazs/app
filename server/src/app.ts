import "dotenv/config";
import express from "express";
import { getConfig } from "./config";
import { join } from "path";
import { movieAPI } from "./movie-api";
import pinoHttp from "pino-http";
import ejs from "ejs";

const {
  logger,
  appPort,
  movieApi: { iconUrl },
} = getConfig();

const app = express();

app.disable("x-powered-by");

app.use(
  pinoHttp({
    logger,
  })
);

app.set("view engine", "ejs");
// This tricks the bundler
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.engine(".ejs", ejs.renderFile);

app.use(express.static(join(__dirname, "../../public")));

app.get("/liveness", (_, res) => {
  res.sendStatus(200);
});

app.get("/readiness", (_, res) => {
  res.sendStatus(200);
});

app.use("/api", movieAPI);

app.get("/", (_, res) => {
  res.render("pages/index", {
    iconUrl: iconUrl,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(<express.ErrorRequestHandler>((err, _, res, __) => {
  logger.error({ msg: err as Error });
  res.send(500);
}));

app.listen(appPort, () => {
  logger.info({ msg: "Application started" });
});
