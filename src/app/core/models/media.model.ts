export type MediaType = 'movie' | 'tv';

export interface MediaSummary {
  id: number;
  mediaType: MediaType;
  title: string;
  year: string | null;
  overview: string;
  posterPath: string | null;
  voteAverage: number;
}

export interface WatchProvider {
  providerId: number;
  name: string;
  logoPath: string | null;
}

export interface WatchProviderGroup {
  link: string | null;
  flatrate: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
}

export interface MediaDetail extends MediaSummary {
  backdropPath: string | null;
  genres: string[];
  runtimeMinutes: number | null;
  providers: WatchProviderGroup | null;
}

/** Raw TMDb API response shapes, mapped to the models above in TmdbService. */
export namespace TmdbApi {
  export interface SearchResult {
    id: number;
    media_type: 'movie' | 'tv' | 'person';
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    overview?: string;
    poster_path: string | null;
    vote_average?: number;
  }

  export interface SearchResponse {
    page: number;
    results: SearchResult[];
    total_pages: number;
    total_results: number;
  }

  export interface Genre {
    id: number;
    name: string;
  }

  export interface Provider {
    provider_id: number;
    provider_name: string;
    logo_path: string | null;
  }

  export interface ProviderRegion {
    link: string;
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
  }

  export interface WatchProvidersResponse {
    results: Record<string, ProviderRegion>;
  }

  export interface DetailResponse {
    id: number;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    genres: Genre[];
    runtime?: number;
    episode_run_time?: number[];
    'watch/providers'?: WatchProvidersResponse;
  }
}
