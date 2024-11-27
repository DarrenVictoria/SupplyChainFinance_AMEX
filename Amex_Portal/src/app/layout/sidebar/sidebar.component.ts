import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Tab {
  iconType: string;
  text: string;
  route: string;
  subTabs?: Tab[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isOpen: boolean = true;
  activeMainTab: Tab | null = null;
  activeSubTab: Tab | null = null;

  profileImageUrl: string = '';

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
            {
              iconType: 'check_box',
              text: 'Approvals',
              route: '/approvals'
            }
          ]
        },
        {
          iconType: 'store',
          text: 'Merchants',
          route: '/merchants'
        }
      ]
    },
    {
      iconType: 'credit_card',
      text: 'Payments',
      route: '/payments'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setRandomProfileImage();
  }

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

  setActiveSubTab(subTab: Tab): void {
    if (subTab.subTabs) {
      subTab.isExpanded = !subTab.isExpanded;
      this.activeSubTab = subTab;
    } else {
      this.router.navigate([subTab.route]);
    }
  }

  navigateToSubSubTab(subSubTab: Tab): void {
    // Directly navigate to the route of the sub-sub tab
    this.router.navigate([subSubTab.route]);
  }

  logout(): void {
    console.log('Logout clicked');
    this.router.navigate(['/login']);
  }

  setRandomProfileImage(): void {
    this.profileImageUrl = `https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Free-File-Download.png`;
  }
}