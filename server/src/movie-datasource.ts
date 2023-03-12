/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosRetry, { exponentialDelay } from "axios-retry";
import { getConfig } from "./config";

const {
  logger,
  movieApi: { url: movieApiUrl, token },
} = getConfig();

export interface SearchParams {
  language?: string;
  query: string;
  page?: string | number;
  include_adult?: boolean;
  region?: string;
  year?: string | number;
  primary_release_year?: string | number;
}

export interface SearchResultPage {
  page: number;
  results: Result[];
  total_results: number;
  total_pages: number;
}

export interface Result {
  poster_path: null | string;
  adult: boolean;
  overview: string;
  release_date: Date;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: null | string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

class APIConnector {
  protected connector: AxiosInstance;
  constructor(options: { baseURL: string; token: string }) {
    const apiConnector = axios.create({
      baseURL: options.baseURL,
    });

    apiConnector.interceptors.request.use((config) => {
      config.headers.setAuthorization(`Bearer ${options.token}`);
      return config;
    });

    apiConnector.interceptors.request.use((config) => {
      logger.info({
        msg: `${String(config.method?.toUpperCase())} ${String(
          config.baseURL
        )}${String(config.url)}`,
      });
      return config;
    });

    axiosRetry(apiConnector, {
      retryDelay: exponentialDelay,
      retries: 5,
    });

    this.connector = apiConnector;
  }

  getConnector(): AxiosInstance {
    return this.connector;
  }

  get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D> & { trid?: string }
  ): Promise<R> {
    return this.connector.get<T, R, D>(url, config);
  }

  post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D> & { trid?: string }
  ): Promise<R> {
    return this.connector.post<T, R, D>(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D> & { trid?: string }
  ): Promise<R> {
    return this.connector.put<T, R, D>(url, data, config);
  }

  patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D> & { trid?: string }
  ): Promise<R> {
    return this.connector.patch<T, R, D>(url, data, config);
  }

  head<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D> & { trid?: string }
  ): Promise<R> {
    return this.connector.head<T, R, D>(url, config);
  }

  options<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D> & { trid?: string }
  ): Promise<R> {
    return this.connector.options<T, R, D>(url, config);
  }

  delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D> & { trid?: string }
  ): Promise<R> {
    return this.connector.delete<T, R, D>(url, config);
  }
}

export class MovieDatasource extends APIConnector {
  constructor(baseURL: string, token: string) {
    super({
      baseURL,
      token,
    });
  }

  async searchMovies(searchParams: SearchParams) {
    return await this.get<SearchResultPage>("/3/search/movie", {
      params: searchParams,
    });
  }
}

const createMovieDatasource = (): (() => MovieDatasource) => {
  let connector: MovieDatasource | null = null;
  return (): MovieDatasource => {
    if (!connector) {
      connector = new MovieDatasource(movieApiUrl, token);
    }
    return connector;
  };
};

export const getMovieDatasource = createMovieDatasource();
