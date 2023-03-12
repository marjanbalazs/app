import pino from "pino";

const APP_PORT = process.env.APP_PORT as string;

const MOVIE_API_URL = process.env.MOVIE_API_URL as string;
const MOVIE_API_TOKEN = process.env.MOVIE_API_TOKEN as string;

const REDIS_HOST = process.env.REDIS_HOST as string;
const REDIS_PORT = process.env.REDIS_PORT as string;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD as string;
const REDIS_USER = process.env.REDIS_USER as string;
const REDIS_TTL = process.env.REDIS_TTL as string;

interface Config {
  logger: pino.Logger;
  appPort: string;
  movieApi: {
    url: string;
    token: string;
  };
  redis: {
    host: string;
    port: string;
    password: string;
    user: string;
    defaultTTL: number;
  };
}

const createConfig = (): (() => Config) => {
  let config: Config | null = null;
  return (): Config => {
    if (!config) {
      const logger = pino({});
      config = {
        logger,
        appPort: APP_PORT,
        movieApi: {
          url: MOVIE_API_URL,
          token: MOVIE_API_TOKEN,
        },
        redis: {
          host: REDIS_HOST,
          port: REDIS_PORT,
          password: REDIS_PASSWORD,
          user: REDIS_USER,
          defaultTTL: REDIS_TTL ? parseInt(REDIS_TTL, 10) : 120,
        },
      };
    }
    return config;
  };
};

export const getConfig = createConfig();
