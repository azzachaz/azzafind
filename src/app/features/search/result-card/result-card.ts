import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { MediaSummary } from '../../../core/models/media.model';
import { TmdbService } from '../../../core/services/tmdb.service';

@Component({
  selector: 'app-result-card',
  imports: [RouterLink, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './result-card.html',
  styleUrl: './result-card.css',
})
export class ResultCard {
  private readonly tmdb = inject(TmdbService);

  readonly media = input.required<MediaSummary>();

  protected readonly posterUrl = computed(() => this.tmdb.posterUrl(this.media().posterPath));
}
