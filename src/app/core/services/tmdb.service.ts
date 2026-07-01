import { Injectable } from '@angular/core';
import type { HttpResourceRequest } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { MediaDetail, MediaSummary, MediaType, TmdbApi, WatchProvider, WatchProviderGroup } from '../models/media.model';

const DEFAULT_REGION = 'AU';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  readonly apiKeyConfigured = !!environment.tmdbApiKey;
  readonly region = DEFAULT_REGION;

  searchRequest(query: string): HttpResourceRequest {
    return {
      url: `${environment.tmdbApiBaseUrl}/search/multi`,
      params: {
        api_key: environment.tmdbApiKey,
        query,
        include_adult: 'false',
      },
    };
  }

  detailRequest(mediaType: MediaType, id: string): HttpResourceRequest {
    return {
      url: `${environment.tmdbApiBaseUrl}/${mediaType}/${id}`,
      params: {
        api_key: environment.tmdbApiKey,
        append_to_response: 'watch/providers',
      },
    };
  }

  posterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' = 'w342'): string | null {
    return path ? `${environment.tmdbImageBaseUrl}/${size}${path}` : null;
  }

  backdropUrl(path: string | null, size: 'w780' | 'w1280' = 'w1280'): string | null {
    return path ? `${environment.tmdbImageBaseUrl}/${size}${path}` : null;
  }

  mapSearchResults(response: TmdbApi.SearchResponse): MediaSummary[] {
    return response.results
      .filter((result): result is TmdbApi.SearchResult & { media_type: MediaType } =>
        result.media_type === 'movie' || result.media_type === 'tv'
      )
      .map((result) => this.toSummary(result));
  }

  mapDetail(mediaType: MediaType, response: TmdbApi.DetailResponse): MediaDetail {
    const title = response.title ?? response.name ?? 'Untitled';
    const date = response.release_date ?? response.first_air_date ?? '';
    const runtime = response.runtime ?? response.episode_run_time?.[0] ?? null;
    const regionProviders = response['watch/providers']?.results[this.region];

    return {
      id: response.id,
      mediaType,
      title,
      year: date ? date.slice(0, 4) : null,
      overview: response.overview,
      posterPath: response.poster_path,
      backdropPath: response.backdrop_path,
      voteAverage: response.vote_average,
      genres: response.genres.map((genre) => genre.name),
      runtimeMinutes: runtime,
      providers: regionProviders ? this.mapProviderGroup(regionProviders) : null,
    };
  }

  private toSummary(result: TmdbApi.SearchResult & { media_type: MediaType }): MediaSummary {
    const title = result.title ?? result.name ?? 'Untitled';
    const date = result.release_date ?? result.first_air_date ?? '';
    return {
      id: result.id,
      mediaType: result.media_type,
      title,
      year: date ? date.slice(0, 4) : null,
      overview: result.overview ?? '',
      posterPath: result.poster_path,
      voteAverage: result.vote_average ?? 0,
    };
  }

  private mapProviderGroup(region: TmdbApi.ProviderRegion): WatchProviderGroup {
    const mapProviders = (providers?: TmdbApi.Provider[]): WatchProvider[] =>
      (providers ?? []).map((provider) => ({
        providerId: provider.provider_id,
        name: provider.provider_name,
        logoPath: provider.logo_path,
      }));

    return {
      link: region.link ?? null,
      flatrate: mapProviders(region.flatrate),
      rent: mapProviders(region.rent),
      buy: mapProviders(region.buy),
    };
  }
}
