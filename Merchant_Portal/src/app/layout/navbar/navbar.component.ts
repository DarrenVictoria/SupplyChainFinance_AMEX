import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';

interface Notification {
  title: string;
  description: string;
  action?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule
  ],
  template: `
    <mat-toolbar class="amex-navbar">
      <button mat-icon-button (click)="toggleSidenav.emit()" class="menu-button">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="spacer"></span>
      
      <button mat-icon-button [matMenuTriggerFor]="notificationsMenu" class="notification-button">
        <mat-icon class="notification-icon">notifications</mat-icon>
        <span *ngIf="notificationCount > 0" class="notification-badge">{{notificationCount}}</span>
      </button>
      
      <span class="date-time">{{currentDate | date:'medium'}}</span>
      <a [routerLink]="['/profile']">
        <img [src]="profileImageUrl" alt="Profile" class="profile-image">
      </a>
    </mat-toolbar>

    <mat-menu #notificationsMenu="matMenu" class="notifications-menu">
      <div class="notifications-list">
        <mat-card *ngFor="let notification of notifications" class="notification-card">
          <mat-card-title>{{ notification.title }}</mat-card-title>
          <mat-card-content>
            <p>{{ notification.description }}</p>
          </mat-card-content>
          <mat-card-actions *ngIf="notification.action">
            <button mat-button class="action-button">{{ notification.action }}</button>
          </mat-card-actions>
        </mat-card>
        <mat-card *ngIf="notifications.length === 0" class="notification-card">
          <mat-card-content>No notifications</mat-card-content>
        </mat-card>
      </div>
    </mat-menu>
  `,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  currentDate = new Date();
  notificationCount = 0;
  profileImageUrl = 'https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Free-File-Download.png';
  notifications: Notification[] = [];

  constructor() {
    setInterval(() => {
      this.currentDate = new Date();
    }, 60);
  }
}
