import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Summary Card Metrics
  summaryMetrics = [
    {
      label: 'Total Invoices',
      value: 24,
      change: '12%',
      changeType: 'positive'
    },
    {
      label: 'Active Suppliers',
      value: 8,
      change: '2 new',
      changeType: 'positive'
    },
    {
      label: 'Total Amount',
      value: 328000,
      change: '8%',
      changeType: 'positive'
    },
    {
      label: 'Pending Approval',
      value: 5,
      change: 'Action needed',
      changeType: 'negative'
    }
  ];

  monthlyData = [
    { month: 'Jan', invoices: 45000, settlements: 42000, suppliers: 5 },
    { month: 'Feb', invoices: 52000, settlements: 48000, suppliers: 6 },
    { month: 'Mar', invoices: 48000, settlements: 46000, suppliers: 7 },
    { month: 'Apr', invoices: 61000, settlements: 55000, suppliers: 8 },
    { month: 'May', invoices: 55000, settlements: 52000, suppliers: 8 },
    { month: 'Jun', invoices: 67000, settlements: 63000, suppliers: 9 },
  ];

  statusDistribution = [
    { name: 'Approved', value: 35, color: '#10B981' },
    { name: 'Pending', value: 25, color: '#F59E0B' },
    { name: 'Rejected', value: 15, color: '#EF4444' },
    { name: 'Completed', value: 25, color: '#3B82F6' },
  ];

  invoiceData = [
    { id: "INV-001", supplier: "Sunrise Innovations LLC", amount: 10000.00, status: "Approved", dueDate: "02/07/2025" },
    { id: "INV-002", supplier: "Vanguard Resource Group LP", amount: 15500.50, status: "Pending", dueDate: "01/05/2025" },
    { id: "INV-003", supplier: "Quantum Edge Systems Inc", amount: 7800.25, status: "Rejected", dueDate: "01/14/2025" },
    { id: "INV-004", supplier: "Maple Leaf Consulting", amount: 22000.75, status: "Completed", dueDate: "12/09/2024" },
  ];

  // Monthly Trends Chart Configuration
  lineChartType: ChartType = 'line';
  monthlyTrendsChartConfig: ChartConfiguration = {
    type: this.lineChartType,
    data: {
      labels: this.monthlyData.map(item => item.month),
      datasets: [
        {
          label: 'Invoices',
          data: this.monthlyData.map(item => item.invoices),
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true
        },
        {
          label: 'Settlements',
          data: this.monthlyData.map(item => item.settlements),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  // Status Distribution Pie Chart
  pieChartType: ChartType = 'pie';
  statusDistributionChartConfig: ChartConfiguration = {
    type: this.pieChartType,
    data: {
      labels: this.statusDistribution.map(item => item.name),
      datasets: [{
        data: this.statusDistribution.map(item => item.value),
        backgroundColor: this.statusDistribution.map(item => item.color)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  };

  constructor() { }

  ngOnInit(): void { }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  getStatusColor(status: string): string {
    const colors = {
      'Approved': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Completed': 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
}