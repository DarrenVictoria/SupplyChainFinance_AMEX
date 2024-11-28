import { Injectable, NgZone } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event as NavigationEvent } from '@angular/router';
import { LoadingService } from './loading.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouterLoadingService {
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private ngZone: NgZone
  ) {
    this.initRouterLoading();
  }

  private initRouterLoading(): void {
    this.ngZone.runOutsideAngular(() => {
      this.router.events.pipe(
        filter(event =>
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        )
      ).subscribe((event: NavigationEvent) => {
        console.group('🚦 Router Navigation Diagnostic');
        console.log('Full Event:', event);

        if (event instanceof NavigationStart) {
          console.log('🔄 Navigation Started');
          this.ngZone.run(() => {
            this.loadingService.show('Router Navigation Start');
          });
        }

        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          console.log('✅ Navigation Completed/Cancelled/Errored');
          this.ngZone.run(() => {
            this.loadingService.hide('Router Navigation End');
          });
        }

        console.groupEnd();
      });
    });
  }
}