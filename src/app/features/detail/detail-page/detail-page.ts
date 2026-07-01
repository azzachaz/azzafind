import { Component, computed, inject, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MediaType, TmdbApi } from '../../../core/models/media.model';
import { TmdbService } from '../../../core/services/tmdb.service';

@Component({
  selector: 'app-detail-page',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './detail-page.html',
  styleUrl: './detail-page.css',
})
export class DetailPage {
  protected readonly tmdb = inject(TmdbService);

  readonly mediaType = input.required<MediaType>();
  readonly id = input.required<string>();

  protected readonly detailResource = httpResource<TmdbApi.DetailResponse>(() =>
    this.tmdb.detailRequest(this.mediaType(), this.id())
  );

  protected readonly detail = computed(() => {
    const raw = this.detailResource.value();
    return raw ? this.tmdb.mapDetail(this.mediaType(), raw) : null;
  });

  protected readonly backdropUrl = computed(() => {
    const detail = this.detail();
    return detail ? this.tmdb.backdropUrl(detail.backdropPath) : null;
  });

  protected readonly posterUrl = computed(() => {
    const detail = this.detail();
    return detail ? this.tmdb.posterUrl(detail.posterPath, 'w342') : null;
  });

  protected providerLogoUrl(logoPath: string | null): string | null {
    return this.tmdb.posterUrl(logoPath, 'w185');
  }
}
