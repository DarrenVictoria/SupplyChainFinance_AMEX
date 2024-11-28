import { Component, Signal, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading()" class="loading-overlay">
      <div class="loading-container">
        <div class="diagnostic-info">
          <p>🔄 Loading Active</p>
          <p>Timestamp: {{ loadTimestamp() }}</p>
        </div>
        <video 
          autoplay 
          loop 
          muted 
          playsinline 
          class="loading-video"
        >
          <source src="assets/loaders/loader.webm" type="video/webm">
          Your browser does not support the video tag.
        </video>
        <p class="loading-text">Loading...</p>
      </div>
    </div>
  `,
  styles: [`
    .diagnostic-info {
      background: rgba(255,0,0,0.1);
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid red;
      text-align: center;
    }
    /* ... rest of your existing styles ... */
  `]
})
export class LoadingComponent {
  isLoading: Signal<boolean>;
  loadTimestamp = signal(new Date().toISOString());

  constructor(loadingService: LoadingService) {
    this.isLoading = loadingService.loading;

    // Add effect to track loading state changes
    effect(() => {
      console.group('🚨 Loading Component State');
      console.log('Current Loading State:', this.isLoading());

      if (this.isLoading()) {
        this.loadTimestamp.set(new Date().toISOString());
      }

      console.groupEnd();
    });
  }
}