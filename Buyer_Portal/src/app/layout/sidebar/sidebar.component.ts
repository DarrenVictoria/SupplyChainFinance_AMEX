import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Tab {
  iconType: string;
  text: string;
  route: string;
  subTabs?: { text: string; route: string }[];
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
  activeTab: Tab | null = null;
  profileImageUrl: string = '';

  tabs: Tab[] = [
    { 
      iconType: 'house', 
      text: 'Homepage', 
      route: '/homepage'
    },
    {
      iconType: 'bar_chart',
      text: 'Dashboard',
      route: '/dashboard'
    },
    {
      iconType: 'account_balance',
      text: 'Merchants',
      route: '/merchants'
    },
    {
      iconType: 'assignment_add',
      text: 'Requests',
      subTabs: [
        { text: 'Creation', route: '/requests/creation' },
        { text: 'Submission', route: '/requests/submission' }
      ],
      route: ''
    },
    {
      iconType: 'local_atm',
      text: 'Payments',
      route: '/payments'
    }
  ];

  settingsTabs: Tab[] = [
    {
      iconType: 'payments',
      text: 'Financial',
      route: '/financial'
    },
    {
      iconType: 'group',
      text: 'Users',
      route: '/users'
    },
    {
      iconType: 'analytics',
      text: 'Business Activities',
      route: '/business-activities'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setRandomProfileImage();
  }

  setActiveTab(tab: Tab): void {
    if (tab.subTabs) {
      // Toggle activeTab for tabs with sub-tabs
      this.activeTab = this.activeTab === tab ? null : tab;
    } else {
      this.activeTab = tab;
      this.router.navigate([tab.route]);
    }
  }
  

  navigateToSubTab(subTab: { text: string; route: string }): void {
    this.router.navigate([subTab.route]);
  }

  logout(): void {
    console.log('Logout clicked');
    // Add logout logic here
  }

  setRandomProfileImage(): void {
    this.profileImageUrl = `https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Free-File-Download.png`;
  }
}
