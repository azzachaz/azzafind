# AzzaFind

Search movies and TV shows and see which streaming services (Netflix, Prime Video, Disney+, etc.) currently carry them, powered by [TMDb](https://www.themoviedb.org/). Built with Angular 21 (standalone, zoneless, signals) and Angular Material.

## Get a TMDb API key

Streaming availability data comes from TMDb, which requires a free API key:

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Go to **Settings → API** ([themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)) and request an API key (choose "Developer").
3. Copy the **API Key (v3 auth)** value.
4. Paste it into `src/environments/environment.ts` as `tmdbApiKey`.

Without a key, the app still builds and runs, but search and detail pages will show a "no API key configured" message instead of results. Watch-provider ("where to watch") data is provided by [JustWatch](https://www.justwatch.com/) via TMDb and is currently scoped to the US region — see `TmdbService.region` in `src/app/core/services/tmdb.service.ts` to change it.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
