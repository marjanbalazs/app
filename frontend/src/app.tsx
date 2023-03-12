import {
  QueryClientProvider,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import React, { PropsWithChildren, StrictMode, useState } from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";

const queryClient = new QueryClient();

type SourceType = "cache" | "API";

interface Movie {
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

interface MovieSearchResponse {
  page: number;
  totalPages: number;
  source?: SourceType;
  resources: Movie[];
}

interface StatusProps {
  loading?: boolean;
  error?: {
    status?: number;
    error?: unknown;
  };
  source?: SourceType;
}

const MovieTile = ({ movie }: { movie: Movie }) => {
  return (
    <div
      className="movie-tile-wrapper"
      style={{
        height: 250,
        width: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="movie-poster-wrapper" style={{ height: 180, width: 120 }}>
        {movie.poster_path ? (
          <img
            style={{
              objectFit: "scale-down",
              maxHeight: "100%",
              maxWidth: "100%",
            }}
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          ></img>
        ) : (
          <div></div>
        )}
      </div>
      <div className="movie-details-wrapper">
        <p style={{ textAlign: "center" }}>{movie.original_title}</p>
      </div>
    </div>
  );
};

const StatusContent = ({ loading, error, source }: StatusProps) => {
  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <p>{`${String(error.status)}: ${String(error.error)}`}</p>
      </div>
    );
  } else if (source) {
    return (
      <div>
        <p>{`The source of the data is: ${source}`}</p>
      </div>
    );
  } else {
    return null;
  }
};

const StatusBar = (props: StatusProps) => {
  return (
    <div
      className="status-bar"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "3rem",
        marginBottom: "1rem",
      }}
    >
      <StatusContent {...props} />
    </div>
  );
};

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="main-layout"
      style={{
        display: "grid",
        gridTemplateAreas: "left content right",
        gridTemplateColumns: "1fr 2fr 1fr",
        gridTemplateRows: "auto",
      }}
    >
      <div></div>
      <div>{children}</div>
      <div></div>
    </div>
  );
};

const App = () => {
  const [searchParamInput, setSearchParamInput] = useState<string | null>();
  const [searchPage, setSearchPage] = useState<number>(1);
  const [searchParam, setSearchParams] = useState<string | null>();
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const {
    data: movieData,
    isFetching,
    error: movieError,
  } = useQuery(
    ["movie-query", searchParam, searchPage],
    async ({ signal }) =>
      axios.get<MovieSearchResponse>("/api/query", {
        signal,
        params: {
          query: searchParam,
          page: searchPage ?? undefined,
        },
      }),
    {
      onSuccess: (data) => {
        setTotalPages(data.data.totalPages);
      },
      keepPreviousData: true,
      enabled: !!searchParam,
      cacheTime: 0,
    }
  );

  const handleSearchParamChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    e.preventDefault();
    setSearchParamInput(e.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setSearchParams(searchParamInput);
    setSearchPage(1);
  };

  const paginationHandler = (i: number) => {
    setSearchPage(i);
  };

  return (
    <MainLayout>
      <div
        className="main-content"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div
          className="search-panel"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Look for a movie</h2>
          <form
            className="search-form"
            style={{ marginBottom: "1rem" }}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              id="movie-search-bar"
              name="search-bar"
              onChange={handleSearchParamChange}
            ></input>
            <input type="submit" value="Submit"></input>
          </form>
        </div>
        <StatusBar
          loading={isFetching}
          error={
            movieError
              ? {
                  status: movieData?.status,
                  error: movieError,
                }
              : undefined
          }
          source={movieData?.data.source}
        />
        {movieData?.data &&
          Array.isArray(movieData.data.resources) &&
          movieData.data.resources.length > 0 && (
            <ul
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                listStyle: "none",
              }}
            >
              {movieData.data.resources.map((elem) => {
                return (
                  <li key={`movie-${String(elem.id)}`}>
                    <MovieTile movie={elem} />
                  </li>
                );
              })}
            </ul>
          )}
        {totalPages && totalPages > 1 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              listStyle: "none",
              gap: "5px",
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
              <div
                key={`movie-${String(i)}`}
                style={{
                  color: i === movieData?.data.page ? "red" : "blue",
                }}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={(e) => {
                  e.preventDefault();
                  paginationHandler(i);
                }}
              >
                {i}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
