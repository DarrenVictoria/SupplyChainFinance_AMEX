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

  // Sample data based on the image
  // Sample data with 30 entries for merchants
merchants: Merchant[] = [
  { id: 1, name: 'Sunrise Innovations LLC', dateCreated: new Date('2024-01-15'), createdBy: 'Mark Smith', registeredBuyer: 'Tyler Phillips', status: 'Accepted' },
  { id: 2, name: 'Vanguard Resource Group LP', dateCreated: new Date('2024-02-18'), createdBy: 'John Bill', registeredBuyer: 'John Bill', status: 'Rejected' },
  { id: 3, name: 'Quantum Edge Systems Inc', dateCreated: new Date('2024-03-12'), createdBy: 'Walter Stan', registeredBuyer: 'Walter Stan', status: 'Accepted' },
  { id: 4, name: 'Maple Leaf Consulting', dateCreated: new Date('2024-04-05'), createdBy: 'Will Black', registeredBuyer: 'Tyler Phillips', status: 'Rejected' },
  { id: 5, name: 'Blue Horizon Ventures LLC', dateCreated: new Date('2024-04-20'), createdBy: 'Smith Stacker', registeredBuyer: 'Harry J', status: 'Accepted' },
  { id: 6, name: 'Global Path Networks', dateCreated: new Date('2024-05-03'), createdBy: 'Steve Backer', registeredBuyer: 'Tyler Phillips', status: 'Pending Approval' },
  { id: 7, name: 'Infinite Growth Ltd.', dateCreated: new Date('2024-05-18'), createdBy: 'Chris Fox', registeredBuyer: 'Jane Doe', status: 'Accepted' },
  { id: 8, name: 'Elemental Strategies Inc.', dateCreated: new Date('2024-06-08'), createdBy: 'Mary Gills', registeredBuyer: 'Kyle Tan', status: 'Rejected' },
  { id: 9, name: 'Rising Tides LLC', dateCreated: new Date('2024-06-20'), createdBy: 'James Watt', registeredBuyer: 'Sam Wise', status: 'Pending Approval' },
  { id: 10, name: 'Apex Solutions', dateCreated: new Date('2024-07-12'), createdBy: 'Anna Brown', registeredBuyer: 'Lisa Frank', status: 'Accepted' },
  { id: 11, name: 'Skyline Industries', dateCreated: new Date('2024-07-29'), createdBy: 'David Crow', registeredBuyer: 'Aaron Lee', status: 'Rejected' },
  { id: 12, name: 'Fusion Dynamics Corp', dateCreated: new Date('2024-08-03'), createdBy: 'John King', registeredBuyer: 'Eli Young', status: 'Pending Approval' },
  { id: 13, name: 'Silver Arrow Ltd.', dateCreated: new Date('2024-08-20'), createdBy: 'Emma Ford', registeredBuyer: 'Karen Beck', status: 'Accepted' },
  { id: 14, name: 'Velocity Ventures', dateCreated: new Date('2024-09-05'), createdBy: 'Maggie Stone', registeredBuyer: 'Tom Green', status: 'Rejected' },
  { id: 15, name: 'Horizon Heights Inc.', dateCreated: new Date('2024-09-15'), createdBy: 'Charles Ray', registeredBuyer: 'Max Stone', status: 'Accepted' },
  { id: 16, name: 'Aurora Enterprises', dateCreated: new Date('2024-10-01'), createdBy: 'Natalie Dawn', registeredBuyer: 'Tyler Phillips', status: 'Pending Approval' },
  { id: 17, name: 'Oceanfront Networks', dateCreated: new Date('2024-10-18'), createdBy: 'Oliver Wells', registeredBuyer: 'John Doe', status: 'Rejected' },
  { id: 18, name: 'Liberty Resources LLC', dateCreated: new Date('2024-11-05'), createdBy: 'Lisa Lane', registeredBuyer: 'Alex Brooks', status: 'Accepted' },
  { id: 19, name: 'Pinnacle Consulting Group', dateCreated: new Date('2024-11-12'), createdBy: 'Steven Paul', registeredBuyer: 'John Gray', status: 'Pending Approval' },
  { id: 20, name: 'Synergy Works', dateCreated: new Date('2024-11-25'), createdBy: 'Tina Grace', registeredBuyer: 'Mike Bright', status: 'Accepted' },
  { id: 21, name: 'Cascade Financial', dateCreated: new Date('2024-12-01'), createdBy: 'Rachel Green', registeredBuyer: 'Walter Stan', status: 'Rejected' },
  { id: 22, name: 'Nexus Growth Partners', dateCreated: new Date('2024-12-10'), createdBy: 'Brandon Cole', registeredBuyer: 'Tyler Phillips', status: 'Pending Approval' },
  { id: 23, name: 'New Horizons Corp', dateCreated: new Date('2024-12-20'), createdBy: 'Sophie Miles', registeredBuyer: 'Sarah White', status: 'Accepted' },
  { id: 24, name: 'Prime Solutions Ltd.', dateCreated: new Date('2024-02-25'), createdBy: 'Tommy West', registeredBuyer: 'Jane Lake', status: 'Rejected' },
  { id: 25, name: 'Elevate Solutions', dateCreated: new Date('2024-03-15'), createdBy: 'Eve Long', registeredBuyer: 'Harry J', status: 'Pending Approval' },
  { id: 26, name: 'Northern Star Ventures', dateCreated: new Date('2024-04-10'), createdBy: 'Jake Lowe', registeredBuyer: 'Oliver Day', status: 'Accepted' },
  { id: 27, name: 'Eureka Global Inc.', dateCreated: new Date('2024-05-28'), createdBy: 'Mark Powell', registeredBuyer: 'Tyler Brooks', status: 'Rejected' },
  { id: 28, name: 'Insight Partners', dateCreated: new Date('2024-06-19'), createdBy: 'Nina Fox', registeredBuyer: 'Chris Lane', status: 'Pending Approval' },
  { id: 29, name: 'Bright Future LLC', dateCreated: new Date('2024-07-17'), createdBy: 'Scott Carter', registeredBuyer: 'John Doe', status: 'Accepted' },
  { id: 30, name: 'Epic Ventures', dateCreated: new Date('2024-08-25'), createdBy: 'Linda Smith', registeredBuyer: 'Sarah Miles', status: 'Rejected' },
];


  displayedColumns: string[] = [
    'id', 'name', 'dateCreated', 'createdBy',
    'registeredBuyer', 'status', 'actions'
  ];

  statusOptions = [
    { value: '', label: 'Any' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'pending', label: 'Pending Approval' }
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      status: [''],
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
      formValues.searchTerm
    );
  }

  resetFilters(): void {
    this.filterForm.reset({
      fromDate: '',
      toDate: '',
      status: '',
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

    if (filters.searchTerm) {
      filtered = filtered.filter(merchant => {
        // Only filter by name since we don't have user count data
        return merchant.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      });
    }

    this.dataSource.data = filtered;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'approved';
      case 'rejected':
        return 'rejected';
      case 'pending approval':
        return 'pending-approval';
      default:
        return '';
    }
  }
}