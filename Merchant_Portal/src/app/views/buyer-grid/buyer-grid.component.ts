import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface Buyer {
  name: string;
  logo: string;
  redirectLink: string;
  isRegistered: boolean; // New property to track registration status
}

@Component({
  selector: 'app-buyer-grid',
  templateUrl: './buyer-grid.component.html',
  styleUrls: ['./buyer-grid.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class BuyerGridComponent implements OnInit {
  buyers: Buyer[] = [
    {
      name: 'Howings Engineering',
      logo: '/howings-logo.png',
      redirectLink: '/howings',
      isRegistered: false
    },
    {
      name: 'Exceer',
      logo: '/exceer-logo.png',
      redirectLink: '/exceer',
      isRegistered: true
    },
    {
      name: 'MFC',
      logo: '/mfc-logo.png',
      redirectLink: '/mfc',
      isRegistered: false
    },
    {
      name: 'JKI Corporation',
      logo: '/jki-logo.png',
      redirectLink: '/jki',
      isRegistered: true
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void { }

  navigateToBuyer(redirectLink: string): void {
    this.router.navigate([redirectLink]);
  }
}