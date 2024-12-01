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
      iconType: 'book',
      text: 'Invoices',
      route: '/invoices'
    },
    {
      iconType: 'local_atm',
      text: 'Payments',
      route: '/payments'
    }
  ];

  settingsTabs: Tab[] = [
    {
      iconType: 'manage_accounts',
      text: 'User Management',
      route: '/user-management'
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
    this.router.navigate(['/login']);
  }

  setRandomProfileImage(): void {
    this.profileImageUrl = `https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Free-File-Download.png`;
  }
}