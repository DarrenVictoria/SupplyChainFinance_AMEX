import { Component, OnInit, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';


// Define an interface to represent the structure of sidebar tabs
// This allows for nested, hierarchical navigation with support for multiple levels
interface Tab {
  iconType: string;
  text: string;
  route: string;
  subTabs?: Tab[];
  isExpanded?: boolean;
  isActive?: boolean;
  isParentActive?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  // Input to control sidebar open/closed state
  @Input() isOpen: boolean = true;

  // Track currently active main and sub tabs
  activeMainTab: Tab | null = null;
  activeSubTab: Tab | null = null;

  // Profile image URL
  profileImageUrl: string = '';
  private routerSubscription: Subscription | null = null;


  // Define the sidebar navigation structure
  tabs: Tab[] = [
    {
      iconType: 'dashboard',
      text: 'Dashboard',
      route: '/dashboard'
    },
    {
      iconType: 'people',
      text: 'Customers',
      route: '/customers',
      subTabs: [
        {
          iconType: 'person',
          text: 'Buyers',
          route: '/buyers',
          subTabs: [
            {
              iconType: 'list',
              text: 'All Buyers',
              route: '/all-buyers'
            },
            {
              iconType: 'person_search',
              text: 'My Buyers',
              route: '/my-buyers'
            },
            // {
            //   iconType: 'check_box',
            //   text: 'Approvals',
            //   route: '/buyers/approvals'
            // }
          ]
        },
        {
          iconType: 'store',
          text: 'Suppliers',
          route: '/suppliers'
        }
      ]
    },
    {
      iconType: 'credit_card',
      text: 'Payments',
      route: '/payments',
    },
    {
      // New Settings section with nested administrative options
      iconType: 'settings',
      text: 'Settings',
      route: '', // No direct route for the Settings section
      subTabs: [
        {
          iconType: 'manage_accounts',
          text: 'User Management',
          route: '/user-management'
        },
        {
          iconType: 'event',
          text: 'Holiday Setup',
          route: '/holidaysetup'
        },
        {
          iconType: 'inventory_2',
          text: 'Types of Products',
          route: '/typeproducts'
        },
        {
          iconType: 'build_circle',
          text: 'Programs',
          route: '/programs'
        }
      ]
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setRandomProfileImage();
    this.trackActiveRoute();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  trackActiveRoute(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveStatus(this.tabs);
    });
  }

  // Recursive method to update active status of tabs
  updateActiveStatus(tabs: Tab[], currentRoute: string = this.router.url): void {
    tabs.forEach(tab => {
      // Check if current route matches this tab's route or its subtabs
      tab.isActive = currentRoute === tab.route ||
        (tab.subTabs && this.hasActiveSubTab(tab.subTabs, currentRoute));

      // Expand parent tabs if a subtab is active
      if (tab.subTabs) {
        tab.isExpanded = tab.subTabs.some(subTab =>
          currentRoute === subTab.route ||
          (subTab.subTabs && this.hasActiveSubTab(subTab.subTabs, currentRoute))
        );
      }

      // Recursively check subtabs
      if (tab.subTabs) {
        this.updateActiveStatus(tab.subTabs, currentRoute);
      }
    });
  }

  // Helper method to check if any subtab is active
  hasActiveSubTab(subTabs: Tab[], currentRoute: string): boolean {
    return subTabs.some(subTab =>
      currentRoute === subTab.route ||
      (subTab.subTabs && this.hasActiveSubTab(subTab.subTabs, currentRoute))
    );
  }

  // Handle main tab selection
  setActiveTab(tab: Tab): void {
    if (tab.subTabs) {
      if (this.activeMainTab === tab) {
        tab.isExpanded = !tab.isExpanded;
      } else {
        if (this.activeMainTab) {
          this.activeMainTab.isExpanded = false;
        }
        this.activeMainTab = tab;
        tab.isExpanded = true;
      }
      this.activeSubTab = null;
    } else {
      this.router.navigate([tab.route]);
    }
  }

  // Handle sub-tab selection
  setActiveSubTab(subTab: Tab): void {
    if (subTab.subTabs) {
      // Toggle sub-tab expansion if it has further sub-tabs
      subTab.isExpanded = !subTab.isExpanded;
      this.activeSubTab = subTab;
    } else {
      // Navigate directly if no further sub-tabs
      this.router.navigate([subTab.route]);
    }
  }

  // Navigate to deepest level sub-tabs
  navigateToSubSubTab(subSubTab: Tab): void {
    this.router.navigate([subSubTab.route]);
  }

  // Logout functionality
  logout(): void {
    console.log('Logout clicked');
    this.router.navigate(['/login']);
  }

  // Set a default profile image
  setRandomProfileImage(): void {
    this.profileImageUrl = `https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Free-File-Download.png`;
  }
}