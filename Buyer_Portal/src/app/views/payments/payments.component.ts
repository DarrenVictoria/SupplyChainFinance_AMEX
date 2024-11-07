import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

interface Payment {
  id: number;
  dateCreated: Date;
  createdBy: string;
  merchant: string;
  model: string;
  totalCreditProvided: number;
  totalReceived: number;
  status: string;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatBadgeModule,
    MatTabsModule,
    MatSelectModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatChipsModule,
    MatMenuModule,
    MatSortModule
  ],
})
export class PaymentsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterForm: FormGroup;
  dataSource: MatTableDataSource<Payment>;
  isFiltersApplied = false;

 payments: Payment[] = [
  {
    id: 576,
    dateCreated: new Date("2024-11-09"),
    createdBy: "Mark Smith",
    merchant: "Compu Smart",
    model: "Reverse Factoring",
    totalCreditProvided: 10000,
    totalReceived: 10000,
    status: "Received"
  },
  {
    id: 577,
    dateCreated: new Date("2024-11-09"),
    createdBy: "Mark Smith",
    merchant: "Compu Smart",
    model: "Reverse Factoring",
    totalCreditProvided: 100000,
    totalReceived: 10000,
    status: "Pending"
  },
  {
    id: 578,
    dateCreated: new Date("2024-11-09"),
    createdBy: "Mark Smith",
    merchant: "Compu Smart, Hospi Aid",
    model: "Reverse Factoring",
    totalCreditProvided: 50000,
    totalReceived: 50000,
    status: "Received"
  },
  {
    id: 579,
    dateCreated: new Date("2024-11-09"),
    createdBy: "Will Black",
    merchant: "Compu Smart, Hospi Aid",
    model: "Reverse Factoring",
    totalCreditProvided: 20000,
    totalReceived: 10000,
    status: "Late"
  },
  {
    id: 340,
    dateCreated: new Date("2024-11-09"),
    createdBy: "Mark Smith",
    merchant: "Hospi Aid",
    model: "Reverse Factoring",
    totalCreditProvided: 40000,
    totalReceived: 40000,
    status: "Received"
  },
  {
    id: 341,
    dateCreated: new Date("2024-11-09"),
    createdBy: "Will Black",
    merchant: "Hospi Aid",
    model: "Reverse Factoring",
    totalCreditProvided: 150000,
    totalReceived: 60000,
    status: "Pending"
  }
];


  displayedColumns: string[] = [
    'id', 'dateCreated', 'createdBy', 'merchant', 'model', 'totalCreditProvided', 'totalReceived', 'status', 'actions'
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      status: [''],
      searchType: ['merchant'],
      searchTerm: ['']
    });

    this.dataSource = new MatTableDataSource(this.payments);
    
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'dateCreated': return new Date(item.dateCreated).getTime();
        case 'totalCreditProvided': return item.totalCreditProvided;
        case 'totalReceived': return item.totalReceived;
        default: return (item as any)[property];
      }
    };
  }

  ngOnInit() {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
      this.checkFiltersApplied();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  checkFiltersApplied() {
    const formValues = this.filterForm.value;
    this.isFiltersApplied = !!(formValues.fromDate || formValues.toDate || formValues.status);
  }

  resetFilters(): void {
    this.filterForm.reset({
      fromDate: '',
      toDate: '',
      status: ''
    });

    this.dataSource.data = this.payments;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.isFiltersApplied = false;
  }

  applyFilters() {
    let filtered = [...this.payments];
    const filters = this.filterForm.value;
  
    if (filters.fromDate) {
      filtered = filtered.filter(payment => 
        payment.dateCreated >= new Date(filters.fromDate)
      );
    }
  
    if (filters.toDate) {
      filtered = filtered.filter(payment => 
        payment.dateCreated <= new Date(filters.toDate)
      );
    }
  
    if (filters.status) {
      filtered = filtered.filter(payment => 
        payment.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
  
    if (filters.searchTerm) {
      filtered = filtered.filter(payment => {
        if (filters.searchType === 'merchant') {
          return payment.merchant.toLowerCase().includes(filters.searchTerm.toLowerCase());
        } else if (filters.searchType === 'model') {
          return payment.model.toLowerCase().includes(filters.searchTerm.toLowerCase());
        }
        return false;
      });
    }
  
    this.dataSource.data = filtered;
    
    // Reset to first page when filters are applied
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'received':
        return 'approved';
      case 'pending':
        return 'pending';
      case 'late':
        return 'late';
      default:
        return '';
    }
  }
}