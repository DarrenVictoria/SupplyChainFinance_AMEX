import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Tab {
  iconType: string;
  text: string;
  route: string;
  subTabs?: { text: string; route: string }[];
}

interface MerchantInfo {
  id: string;
  name: string;
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
  merchantInfo: MerchantInfo;

  tabs: Tab[] = [
    {
      iconType: 'bar_chart',
      text: 'Dashboard',
      route: '/dashboard'
    },
    {
      iconType: 'apartment',
      text: 'Buyers',
      route: '/buyers'
    },
    {
      iconType: 'book',
      text: 'Invoices',
      route: '/invoices'
    },
  ];

  constructor(private router: Router) {
    this.merchantInfo = {
      id: 'MERCH123456',
      name: 'Sample Merchant'
    };
  }

  ngOnInit(): void {
    this.setRandomProfileImage();
  }

  setActiveTab(tab: Tab): void {
    this.activeTab = tab;
    this.router.navigate([tab.route]);
  }

  logout(): void {
    console.log('Logout clicked');
    this.router.navigate(['/login']);
  }

  setRandomProfileImage(): void {
    this.profileImageUrl = `https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Free-File-Download.png`;
  }
}