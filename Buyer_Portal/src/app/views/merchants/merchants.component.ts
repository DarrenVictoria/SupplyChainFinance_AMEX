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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

interface Merchant {
  id: number;
  name: string;
  dateCreated: Date;
  createdBy: string;
  registeredBuyer: string;
  status: 'Active' | 'Inactive';
  approvalStatus: 'Approved' | 'Rejected' | 'Pending Approval';
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatChipsModule,
    MatMenuModule,
    MatSortModule
  ],
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.css']
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
    {
      id: 1,
      name: 'Sunrise Innovations LLC',
      dateCreated: new Date('2024-01-15'),
      createdBy: 'Mark Smith',
      registeredBuyer: 'Tyler Phillips',
      status: 'Active',
      approvalStatus: 'Approved'
    },
    {
      id: 2,
      name: 'Vanguard Resource Group LP',
      dateCreated: new Date('2024-02-18'),
      createdBy: 'John Bill',
      registeredBuyer: 'John Bill',
      status: 'Inactive',
      approvalStatus: 'Rejected'
    },
    {
      id: 3,
      name: 'Quantum Edge Systems Inc',
      dateCreated: new Date('2024-03-12'),
      createdBy: 'Walter Stan',
      registeredBuyer: 'Walter Stan',
      status: 'Active',
      approvalStatus: 'Approved'
    },
    {
      id: 4,
      name: 'Maple Leaf Consulting',
      dateCreated: new Date('2024-04-05'),
      createdBy: 'Will Black',
      registeredBuyer: 'Tyler Phillips',
      status: 'Inactive',
      approvalStatus: 'Rejected'
    },
    {
      id: 5,
      name: 'Blue Horizon Ventures LLC',
      dateCreated: new Date('2024-04-20'),
      createdBy: 'Smith Stacker',
      registeredBuyer: 'Harry J',
      status: 'Active',
      approvalStatus: 'Pending Approval'
    }
  ];

  displayedColumns: string[] = [
    'id', 'name', 'dateCreated', 'createdBy',
    'registeredBuyer', 'status', 'approvalStatus', 'actions'
  ];

  statusOptions = [
    { value: '', label: 'Any' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  approvalStatusOptions = [
    { value: '', label: 'Any' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'pending approval', label: 'Pending Approval' }
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      status: [''],
      approvalStatus: [''],
      searchType: ['name'],
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
    this.isFiltersApplied = !!(
      formValues.fromDate ||
      formValues.toDate ||
      formValues.status ||
      formValues.approvalStatus ||
      formValues.searchTerm
    );
  }

  resetFilters(): void {
    this.filterForm.reset({
      fromDate: '',
      toDate: '',
      status: '',
      approvalStatus: '',
      searchType: 'name',
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

    if (filters.fromDate) {
      filtered = filtered.filter(merchant =>
        merchant.dateCreated >= new Date(filters.fromDate)
      );
    }

    if (filters.toDate) {
      filtered = filtered.filter(merchant =>
        merchant.dateCreated <= new Date(filters.toDate)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(merchant =>
        merchant.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.approvalStatus) {
      filtered = filtered.filter(merchant =>
        merchant.approvalStatus.toLowerCase() === filters.approvalStatus.toLowerCase()
      );
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(merchant =>
        merchant.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    this.dataSource.data = filtered;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      default:
        return '';
    }
  }

  getApprovalStatusClass(approvalStatus: string): string {
    switch (approvalStatus.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending approval':
        return 'status-pending-approval';
      default:
        return '';
    }
  }

  onAccept(merchant: Merchant) {
    console.log('Accepted:', merchant);
    // Implement your accept logic here
  }

  onReject(merchant: Merchant) {
    console.log('Rejected:', merchant);
    // Implement your reject logic here
  }

  onInfo(merchant: Merchant) {
    console.log('Info:', merchant);
    // Implement your info logic here
  }

}