import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TmdbService } from '../../../core/services/tmdb.service';
import { TmdbApi } from '../../../core/models/media.model';
import { ResultCard } from '../result-card/result-card';

@Component({
  selector: 'app-search-page',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, ResultCard],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
})
export class SearchPage {
  protected readonly tmdb = inject(TmdbService);

  protected readonly query = signal('');

  private readonly debouncedQuery = toSignal(
    toObservable(this.query).pipe(
      map((value) => value.trim()),
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  protected readonly searchResource = httpResource<TmdbApi.SearchResponse>(() => {
    const term = this.debouncedQuery();
    return term.length >= 2 ? this.tmdb.searchRequest(term) : undefined;
  });

  protected readonly results = computed(() => {
    const raw = this.searchResource.value();
    return raw ? this.tmdb.mapSearchResults(raw) : [];
  });

  protected onQueryInput(value: string): void {
    this.query.set(value);
  }
}
