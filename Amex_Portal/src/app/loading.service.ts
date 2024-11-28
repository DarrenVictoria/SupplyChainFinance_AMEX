import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private _loading = signal(false);

    loading = this._loading.asReadonly();

    show(caller: string = 'Unknown'): void {
        console.group('🔍 Loading Service - Show');
        console.log('Called by:', caller);
        console.log('Previous State:', this._loading());

        this._loading.set(true);

        console.log('New State:', this._loading());
        console.groupEnd();
    }

    hide(caller: string = 'Unknown'): void {
        console.group('🔍 Loading Service - Hide');
        console.log('Called by:', caller);
        console.log('Previous State:', this._loading());

        this._loading.set(false);

        console.log('New State:', this._loading());
        console.groupEnd();
    }
}