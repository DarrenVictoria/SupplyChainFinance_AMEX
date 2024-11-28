import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass, CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    NgClass,
    CommonModule
  ],
  template: `
    <div 
      class="app-container" 
      [class.sidebar-collapsed]="!isSidebarOpen"
      [class.mobile-view]="isMobileView">
      
      <!-- Toggle Button -->
      <button 
        class="toggle-sidebar-btn" 
        (click)="toggleSidebar()">
        ☰
      </button>
      
      <app-sidebar 
        [ngClass]="{ 
          'hidden': !isSidebarOpen, 
          'mobile-sidebar': isMobileView 
        }" 
        class="sidebar">
      </app-sidebar>
      
      <div 
        class="main-content" 
        [class.blurred]="isMobileView && isSidebarOpen">
        <app-navbar></app-navbar>
        
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
      width: 100%;
    }

    .sidebar {
      width: 260px;
      height: 100%;
      transition: all 0.3s ease;
      flex-shrink: 0;
      background-color: #f0f0f0;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }

    .sidebar.hidden {
      width: 0;
      overflow: hidden;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      width: calc(100% - 260px);
      transition: all 0.3s ease;
    }

    .page-container {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background-color: #f8f9fa;
    }

    .app-container.sidebar-collapsed .sidebar {
      width: 0;
    }

    .app-container.sidebar-collapsed .main-content {
      width: 100%;
    }

    /* Toggle Button Styles */
    .toggle-sidebar-btn {
      position: fixed;
      top: 6px;
      left: 6px;
      z-index: 1100; /* Ensure it is above other elements */
      padding: 5px 7.5px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease;
    }

    .toggle-sidebar-btn:hover {
      background-color: #0056b3;
    }

    /* Mobile View Styles */
    @media (max-width: 768px) {
      .mobile-view .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        width: 260px;
        height: 100%;
        background-color: white;
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
      }

      .mobile-view .main-content.blurred {
        filter: blur(5px);
        pointer-events: none;
        opacity: 0.7;
      }

      .mobile-view .sidebar.hidden {
        transform: translateX(-100%);
      }

      .mobile-view .app-container .sidebar {
        width: 0;
      }

      .mobile-view .app-container .main-content {
        width: 100%;
      }

      .toggle-sidebar-btn {
        top: 10px;
        left: 10px;
        font-size: 1.2rem;
        padding: 8px 12px;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isSidebarOpen = true;
  isMobileView = false;

  ngOnInit() {
    this.checkMobileView();
  }

  @HostListener('window:resize')
  checkMobileView() {
    this.isMobileView = window.innerWidth <= 768;

    // Close sidebar on mobile when screen is resized
    if (this.isMobileView) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  ngOnDestroy() {
    // Cleanup if needed
  }
}
