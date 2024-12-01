import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { loadingInterceptor } from './loading.interceptor';
import { RouterLoadingService } from './router-loading.service';
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(MatDialogModule),
    provideHttpClient(
      withInterceptors([loadingInterceptor])
    ),
    RouterLoadingService // Ensure this is added
  ]
};