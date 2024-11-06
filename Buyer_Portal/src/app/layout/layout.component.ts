import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, NgClass, FooterComponent],
  template: `
    <div class="app-container" [class.sidebar-collapsed]="!isSidebarOpen">
      <app-sidebar [ngClass]="{ 'hidden': !isSidebarOpen }" class="sidebar"></app-sidebar>
      <div class="main-content">
        <app-navbar (toggleSidenav)="toggleSidebar()"></app-navbar>
        <div class="page-container">
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 260px;
      height: 100%;
      transition: transform 0.3s ease;
      flex-shrink: 0;
    }

    .sidebar.hidden {
      transform: translateX(-280px);
      position: absolute;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      transition: margin-left 0.3s ease;
      width: calc(100% - 260px);
    }

    .app-container.sidebar-collapsed .main-content {
      width: 100%;
      margin-left: 0;
    }

    .amex-navbar {
      display: flex;
      align-items: center;
      height: 64px;
      padding: 0 16px;
      background-color: #3f51b5;
      color: #fff;
      transition: width 0.3s ease;
      box-sizing: border-box;
    }

    .page-container {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background-color: #f8f9fa;
      width: 100%;
    }
  `]
})
export class MainLayoutComponent {
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}