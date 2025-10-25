export interface MediaOption {
  id: number;
  name: string;
}

export interface Query {
  name?: string;
  id?: string;
}

interface ProductionCompany {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

interface Season {
  air_date?: string;
  episode_count?: number;
  id?: number;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  season_number?: number;
}

export interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  original_language?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  homepage?: string;
}

export interface SearchResponse {
  page?: number;
  results?: SearchResult[];
  total_pages?: number;
  total_results?: number;
}

export interface MovieResult extends SearchResult {
  belongs_to_collection?: Collection | null;
  genres?: Genre[];
  production_companies?: ProductionCompany[];
  runtime?: number;
  status?: string;
}

export interface SeriesResult extends SearchResult {
  genres?: Genre[];
  production_companies?: ProductionCompany[];
  status?: string;
  seasons?: Season[];
}


interface BaseMediaInfo {
    name: string;
    description: string;
    language: string;
    artwork: string;
    cover: string;
    producers: string[];
    genres: string[];
    status: string;
    community_score: number;
}

export interface MovieInfo extends BaseMediaInfo {
    series: string[];
    release_date: string;
    runtime: number;
}

interface SeasonInfo {
    name: string;
    cover: string;
    episodes: number;
}

export interface SeriesInfo extends BaseMediaInfo {
    release_date: string;
    seasons: SeasonInfo[];
}

export type MediaResult = MovieResult | SeriesResult;
export type MediaInfo = MovieInfo | SeriesInfo;
