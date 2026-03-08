const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_KEY = "2dca580c2a14b55200e784d157207b4d";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export const getImageUrl = (path: string | null) =>
  path ? `${IMG_BASE}${path}` : null;

export async function fetchGenres(): Promise<Genre[]> {
  const res = await fetch(`${TMDB_BASE}/genre/movie/list?api_key=${TMDB_KEY}&language=en-US`);
  const data = await res.json();
  return data.genres;
}

export async function discoverMovies(genreId: number, year?: number): Promise<Movie[]> {
  let url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&language=en-US&sort_by=vote_average.desc&vote_count.gte=200&with_genres=${genreId}&page=1`;
  if (year) {
    url += `&primary_release_year=${year}`;
  }
  const res = await fetch(url);
  const data = await res.json();
  return data.results?.slice(0, 12) ?? [];
}
