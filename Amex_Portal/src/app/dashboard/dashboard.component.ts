import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,

} from 'ng2-charts';


import {
  ChartConfiguration,
  ChartOptions,
  ChartType,

} from 'chart.js';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    MatSelectModule,
    MatFormFieldModule,
    DatePipe
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentDate: Date = new Date();
  // Key Metrics
  keyMetrics = {
    totalBuyers: 150,
    totalSuppliers: 200,
    activePrograms: 25,
    pendingApprovals: 45,
    totalCreditUtilized: 5000000,
    totalEarlyPayments: 2500000
  };

  // Pie Chart Configuration
  pieChartType: ChartType = 'pie';
  pieChartConfiguration: ChartConfiguration = {
    type: this.pieChartType,
    data: {
      labels: ['Direct Payment', 'Approved Invoice Factoring'],
      datasets: [{
        data: [60, 40],
        backgroundColor: ['#8884d8', '#82ca9d']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Financing Product Utilization'
        }
      }
    }
  };

  // Bar Chart Configuration
  barChartType: ChartType = 'bar';
  barChartConfiguration: ChartConfiguration = {
    type: this.barChartType,
    data: {
      labels: ['Buyer A', 'Buyer B', 'Buyer C'],
      datasets: [
        {
          label: 'Credit Utilized',
          data: [1000000, 750000, 500000],
          backgroundColor: '#8884d8'
        },
        {
          label: 'Available Credit',
          data: [500000, 250000, 500000],
          backgroundColor: '#82ca9d'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Credit Utilization by Buyers'
        }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true }
      }
    }
  };

  // Line Chart Configuration
  lineChartType: ChartType = 'line';
  lineChartConfiguration: ChartConfiguration = {
    type: this.lineChartType,
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Monthly Payments',
        data: [500000, 600000, 700000, 800000, 900000, 1000000],
        borderColor: '#8884d8',
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Invoices Financed'
        }
      }
    }
  };

  // Reports Data
  programPerformanceReport = [
    { program: 'Direct Payment', transactions: 120, totalValue: 3000000 },
    { program: 'Approved Invoice Factoring', transactions: 80, totalValue: 2000000 }
  ];

  buyerPerformanceReport = [
    { buyer: 'Buyer A', program: 'Direct Payment', creditUsed: 1000000 },
    { buyer: 'Buyer B', program: 'Approved Invoice Factoring', creditUsed: 750000 }
  ];

  supplierPaymentReport = [
    { supplier: 'Supplier X', totalPayments: 500000, avgProcessingTime: '3 days' },
    { supplier: 'Supplier Y', totalPayments: 400000, avgProcessingTime: '2.5 days' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Optional: if you want to update the date periodically
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000); // Updates every second
  }

  // Method to format currency
  formatCurrency(value: number): string {
    return `$${value.toLocaleString()}`;
  }
}