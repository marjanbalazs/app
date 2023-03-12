import express from "express";
import {
  flushRedis,
  getCacheSearchResult,
  storeCacheSearchResult,
} from "./cache";
import { getMovieDatasource, SearchParams } from "./movie-datasource";

type SourceType = "cache" | "API";

interface StoredSearchResult {
  page: number;
  totalPages: number;
  resources: object[];
}

interface MovieSearchResponse extends StoredSearchResult {
  source: SourceType;
}

export const movieAPI = express.Router();

movieAPI.use(express.json());

movieAPI.get("/query", <
  express.RequestHandler<object, MovieSearchResponse, unknown, SearchParams>
>(async (req, res, next) => {
  const params = req.query;
  try {
    const cacheResult = await getCacheSearchResult<StoredSearchResult>(params);
    if (cacheResult) {
      res.status(200).send({
        ...cacheResult,
        source: "cache",
      });
      next();
    } else {
      const movieConnector = getMovieDatasource();
      const { data } = await movieConnector.searchMovies(params);
      const result = {
        page: data.page,
        totalPages: data.total_pages,
        resources: data.results,
      };
      await storeCacheSearchResult<StoredSearchResult>(params, result);
      res.status(200).send({
        ...result,
        source: "API",
      });
    }
  } catch (e) {
    next(e);
  }
}));

// Should probably protect this endpoint
// eslint-disable-next-line @typescript-eslint/no-misused-promises
movieAPI.post("/bust-cache", async (_, res, next) => {
  try {
    await flushRedis();
    res.send(200);
  } catch (e) {
    next(e);
  }
});
