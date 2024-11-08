import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from './dashboard.service';
import { DashboardData } from './dashboard.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardData: DashboardData = {
    companyName: '',
    statusMessage: '',
    isLive: false,
    requests: {
      ongoing: 0,
      completed: 0,
      pending: 0
    },
    payments: {
      received: 0,
      pendingInvoices: 0
    }
  };
  private destroy$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.dashboardData = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}