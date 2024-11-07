import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

interface Merchant {
  id: number;
  merchantName: string;
  contactPerson: string;
  mobileNo: string;
  email: string;
  address: string;
  status: string;
}

@Component({
  selector: 'app-merchants',
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
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatMenuModule,
    MatSortModule
  ],
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.scss']
})
export class MerchantsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterForm: FormGroup;
  activeTabIndex = 0;
  dataSource: MatTableDataSource<Merchant>;
  isFiltersApplied = false;

  showMerchantsContent = true;
  showApproveMerchantsContent = false;

  merchants: Merchant[] = [
    { id: 1, merchantName: 'Fu Shop', contactPerson: 'John Doe', mobileNo: '0123456789', email: 'merchant@mail.com', address: '123 ABC Road', status: 'Pending Approval' },
    { id: 2, merchantName: 'Paradise Store', contactPerson: 'Daniel P', mobileNo: '0234567890', email: 'merchant@mail.com', address: '456 ABC Road', status: 'Approved' },
    { id: 3, merchantName: 'Orion Mall', contactPerson: 'Sarah Lee', mobileNo: '0345678901', email: 'merchant@mail.com', address: '789 ABC Road', status: 'Approved' },
    { id: 4, merchantName: 'Black Steel', contactPerson: 'John Mark', mobileNo: '0456789012', email: 'merchant@mail.com', address: '012 ABC Road', status: 'Pending Approval' },
    { id: 5, merchantName: 'Paris Arts', contactPerson: 'Daniel Mark', mobileNo: '0567890123', email: 'merchant@mail.com', address: '345 ABC Road', status: 'Approved' }
  ];

  displayedColumns: string[] = [
    'id', 'merchantName', 'contactPerson', 'mobileNo',
    'email', 'address', 'status', 'actions'
  ];

  statusOptions = [
    { value: '', label: 'Any' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending approval', label: 'Pending Approval' }
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: [''],
      searchTerm: ['']
    });

    this.dataSource = new MatTableDataSource(this.merchants);
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

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    this.showMerchantsContent = this.activeTabIndex === 0;
    this.showApproveMerchantsContent = this.activeTabIndex === 1;
  }

  checkFiltersApplied() {
    const formValues = this.filterForm.value;
    this.isFiltersApplied = !!(formValues.status || formValues.searchTerm);
  }

  resetFilters(): void {
    this.filterForm.reset({
      status: '',
      searchTerm: ''
    });

    this.dataSource.data = this.merchants;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.isFiltersApplied = false;
  }

  applyFilters() {
    let filtered = [...this.merchants];
    const filters = this.filterForm.value;

    if (filters.status) {
      filtered = filtered.filter(merchant => 
        merchant.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(merchant =>
        merchant.merchantName.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    this.dataSource.data = filtered;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'approved';
      case 'pending approval':
        return 'pending-approval';
      default:
        return '';
    }
  }

  inviteMerchant() {
    // Implement the logic for inviting a merchant, e.g., open a dialog or navigate to an invite page
    console.log('Invite Merchant button clicked');
  }
  
}