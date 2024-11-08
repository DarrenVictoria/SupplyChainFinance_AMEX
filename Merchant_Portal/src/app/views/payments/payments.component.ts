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
  id: string;
  dateCreated: Date;
  createdBy: string;
  buyer: string;
  model: string;
  creditGiven: number;
  remainingBalance: number;
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
      id: 'REQ-CS-576',
      dateCreated: new Date("2024-11-09"),
      createdBy: "Mark Smith",
      buyer: "Brooks Holdings",
      model: "Reverse Factoring",
      creditGiven: 50000.00,
      remainingBalance: 0.00,
      status: "Completed"
    },
    {
      id: 'REQ-CS-577',
      dateCreated: new Date("2024-11-09"),
      createdBy: "Mark Smith",
      buyer: "Tytan Holdings",
      model: "Reverse Factoring",
      creditGiven: 75000.00,
      remainingBalance: 30000.00,
      status: "Pending"
    },
    {
      id: 'REQ-CS-578',
      dateCreated: new Date("2024-11-09"),
      createdBy: "Mark Smith",
      buyer: "Tytan Holdings",
      model: "Reverse Factoring",
      creditGiven: 60000.00,
      remainingBalance: 0.00,
      status: "Completed"
    },
    {
      id: 'REQ-CS-579',
      dateCreated: new Date("2024-11-09"),
      createdBy: "Will Black",
      buyer: "Tytan Holdings",
      model: "Reverse Factoring",
      creditGiven: 50500.50,
      remainingBalance: 10000.00,
      status: "Delayed"
    },
    {
      id: 'REQ-HA-340',
      dateCreated: new Date("2024-11-09"),
      createdBy: "Mark Smith",
      buyer: "Tytan Holdings",
      model: "Reverse Factoring",
      creditGiven: 70000.00,
      remainingBalance: 0.00,
      status: "Completed"
    },
    {
      id: 'REQ-HA-341',
      dateCreated: new Date("2024-11-09"),
      createdBy: "Will Black",
      buyer: "Zulify Enterprises",
      model: "Reverse Factoring",
      creditGiven: 30500.00,
      remainingBalance: 25000.00,
      status: "Pending"
    },
    {
      id: 'REQ-HA-340',
      dateCreated: new Date("2024-11-09"),
      createdBy: "Mark Smith",
      buyer: "Tytan Holdings",
      model: "Reverse Factoring",
      creditGiven: 70000.00,
      remainingBalance: 0.00,
      status: "Completed"
    },
    {
      id: 'REQ-HA-341',
      dateCreated: new Date("2024-11-09"),
      createdBy: "Will Black",
      buyer: "Zulify Enterprises",
      model: "Reverse Factoring",
      creditGiven: 30500.00,
      remainingBalance: 25000.00,
      status: "Pending"
    }
  ];

  displayedColumns: string[] = [
    'id', 'dateCreated', 'createdBy', 'buyer', 'model', 'creditGiven', 'remainingBalance', 'status', 'actions'
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      status: [''],
      searchType: ['buyer'],
      searchTerm: ['']
    });

    this.dataSource = new MatTableDataSource(this.payments);
    
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'dateCreated': return new Date(item.dateCreated).getTime();
        case 'creditGiven': return item.creditGiven;
        case 'remainingBalance': return item.remainingBalance;
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
        if (filters.searchType === 'buyer') {
          return payment.buyer.toLowerCase().includes(filters.searchTerm.toLowerCase());
        } else if (filters.searchType === 'model') {
          return payment.model.toLowerCase().includes(filters.searchTerm.toLowerCase());
        }
        return false;
      });
    }
  
    this.dataSource.data = filtered;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'approved';
      case 'pending':
        return 'pending';
      case 'delayed':
        return 'late';
      default:
        return '';
    }
  }
}