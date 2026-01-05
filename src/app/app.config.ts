// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { ExportAsService } from 'ngx-export-as';

// import { routes } from './app.routes';
// import { provideHttpClient } from '@angular/common/http';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// export const appConfig: ApplicationConfig = {
//    providers: [
//     provideHttpClient(),
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes),
//     provideAnimationsAsync(),
//     ExportAsService  // ✅ Yahan provide kiya
//   ]
// };
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ExportAsService } from 'ngx-export-as';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './services/Interceptor';

export const appConfig: ApplicationConfig = {
   providers: [
    provideHttpClient(
        withInterceptors([authInterceptor])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    ExportAsService  
  ]
};
