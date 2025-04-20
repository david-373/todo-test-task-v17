import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideIndexedDBDataBaseName,
  provideLocalStoragePrefix,
} from '@ngx-pwa/local-storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideLocalStoragePrefix('todo_'),
    provideIndexedDBDataBaseName('todoStorage'),
  ],
};
