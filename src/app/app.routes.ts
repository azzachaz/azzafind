import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/search/search-page/search-page').then((m) => m.SearchPage),
  },
  {
    path: 'title/:mediaType/:id',
    loadComponent: () => import('./features/detail/detail-page/detail-page').then((m) => m.DetailPage),
  },
  { path: '**', redirectTo: '' },
];
