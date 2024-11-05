import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common'; // <-- Import NgClass here
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, NgClass], // <-- Add NgClass here
  template: `
    <div class="app-container" [class.sidebar-collapsed]="!isSidebarOpen">
      <!-- Sidebar: Toggle display based on sidebar open/close state -->
      <app-sidebar [ngClass]="{ 'hidden': !isSidebarOpen }" class="sidebar"></app-sidebar>
      
      <!-- Main Content Area -->
      <div class="main-content">
        <app-navbar (toggleSidenav)="toggleSidebar()"></app-navbar>
        
        <div class="page-container">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* App Container - Flex Layout */
    .app-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* Sidebar Styling */
    .sidebar {
      width: 260px;
      height: 100%;
      transition: transform 0.3s ease;
      flex-shrink: 0;
    }
    /* Hide sidebar when collapsed */
    .sidebar.hidden {
      transform: translateX(-280px);
      position: absolute;
    }

    /* Main Content Area */
    .main-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      transition: width 0.3s ease;
      overflow: hidden;
    }

    /* Navbar Specific Styling */
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

    /* Full-width Navbar when sidebar is collapsed */
    .app-container.sidebar-collapsed .amex-navbar {
      width: 100%;
    }

    /* Page Container */
    .page-container {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background-color: #f8f9fa;
    }
  `]
})
export class MainLayoutComponent {
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
