import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,

  ],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Financial data
  financialSummary = {
    totalInvoiceAmount: 61301.50,
    totalFinancedAmount: 38606.00,
    pendingAmount: 22695.50,
    averageFinancingRate: 20,
  };

  pieData = [
    { name: "Financed", value: this.financialSummary.totalFinancedAmount },
    { name: "Pending", value: this.financialSummary.pendingAmount },
  ];

  statusData = [
    { status: "Completed", amount: 21340.00, count: 1 },
    { status: "In Progress", amount: 24735.00, count: 2 },
    { status: "Pending", amount: 15226.50, count: 2 },
  ];

  // Pie Chart Configuration
  pieChartType: ChartType = 'pie';
  barChartType: ChartType = 'bar';

  pieChartConfig: ChartConfiguration = {
    type: this.pieChartType,
    data: {
      labels: this.pieData.map(item => item.name),
      datasets: [{
        data: this.pieData.map(item => item.value),
        backgroundColor: ['#8884d8', '#82ca9d']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Keep this false
      layout: {
        padding: 10 // Add some padding
      },
      plugins: {
        title: {
          display: true,
          text: 'Finance Distribution'
        },
        legend: {
          position: 'bottom' // Move legend to bottom
        }
      }
    }
  };

  barChartConfig: ChartConfiguration = {
    type: this.barChartType,
    data: {
      labels: this.statusData.map(item => item.status),
      datasets: [{
        label: 'Payment Status',
        data: this.statusData.map(item => item.amount),
        backgroundColor: '#8884d8'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Crucial for full height
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10
        }
      },
      plugins: {
        title: {
          display: false // Remove title to maximize chart area
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            padding: 10
          }
        },
        x: {
          ticks: {
            padding: 10
          }
        }
      }
    }
  };

  constructor() { }

  ngOnInit(): void { }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  }
}