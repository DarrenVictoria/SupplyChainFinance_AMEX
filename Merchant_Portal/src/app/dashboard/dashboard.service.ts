import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { DashboardData } from './dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardData = new BehaviorSubject<DashboardData>({
    companyName: 'CompuSmart',
    statusMessage: 'Statistics Updating Live',
    isLive: true,
    requests: {
      ongoing: 22,
      completed: 46,
      pending: 141
    },
    payments: {
      received: 22,
      pendingInvoices: 22
    }
  });

  getDashboardData(): Observable<DashboardData> {
    return this.dashboardData.asObservable();
  }

  // Method to update data - can be called by API or WebSocket
  updateDashboardData(newData: Partial<DashboardData>) {
    this.dashboardData.next({
      ...this.dashboardData.value,
      ...newData
    });
  }
}