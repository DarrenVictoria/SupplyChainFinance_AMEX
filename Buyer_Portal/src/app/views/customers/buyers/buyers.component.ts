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

interface Buyer {
  id: number;
  name: string;
  dateCreated: Date;
  createdBy: string;
  accountManager: string;
  noOfUsers: number;
  status: string;
}

@Component({
  selector: 'app-buyers',
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
  templateUrl: './buyers.component.html',
  styleUrls: ['./buyers.component.css']
})
export class BuyersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterForm: FormGroup;
  activeTabIndex = 0;
  dataSource: MatTableDataSource<Buyer>;
  isFiltersApplied = false;

  showBuyersContent = true;
  showApproveBuyersContent = false;
  showManageBuyersContent = false;
  showApproveRequestContent = false;

  buyers: Buyer[] = [
    { id: 1, name: 'Skyline Innovations LLC', dateCreated: new Date('2024-01-15'), createdBy: 'Mark Smith', accountManager: 'Mark Smith', noOfUsers: 5, status: 'Approved' },
    { id: 2, name: 'Vanguard Resource Group LP', dateCreated: new Date('2024-01-17'), createdBy: 'John Bill', accountManager: 'John Bill', noOfUsers: 4, status: 'Review' },
    { id: 3, name: 'Quantum Edge Systems Inc', dateCreated: new Date('2024-01-21'), createdBy: 'Walter Stan', accountManager: 'Walter Stan', noOfUsers: 6, status: 'Rejected' },
    { id: 4, name: 'Pinnacle Data Solutions', dateCreated: new Date('2024-02-05'), createdBy: 'Sarah Lin', accountManager: 'Sarah Lin', noOfUsers: 8, status: 'Pending Approval' },
    { id: 5, name: 'Streamline Ventures', dateCreated: new Date('2024-02-19'), createdBy: 'Alice Brown', accountManager: 'Alice Brown', noOfUsers: 7, status: 'Approved' },
    { id: 6, name: 'Lighthouse Consulting Group', dateCreated: new Date('2024-03-01'), createdBy: 'Michael Chen', accountManager: 'Michael Chen', noOfUsers: 9, status: 'Incomplete' },
    { id: 7, name: 'Harbor Technologies', dateCreated: new Date('2024-03-12'), createdBy: 'Emily Tran', accountManager: 'Emily Tran', noOfUsers: 6, status: 'Review' },
    { id: 8, name: 'Everest Management Ltd', dateCreated: new Date('2024-03-25'), createdBy: 'Tom Hanks', accountManager: 'Tom Hanks', noOfUsers: 10, status: 'Approved' },
    { id: 9, name: 'Orion Global Holdings', dateCreated: new Date('2024-04-04'), createdBy: 'Olivia Carter', accountManager: 'Olivia Carter', noOfUsers: 5, status: 'Rejected' },
    { id: 10, name: 'Blue Sky Enterprises', dateCreated: new Date('2024-04-18'), createdBy: 'James White', accountManager: 'James White', noOfUsers: 3, status: 'Pending Approval' },
    { id: 11, name: 'Wavecrest Industries', dateCreated: new Date('2024-05-01'), createdBy: 'Natalie Green', accountManager: 'Natalie Green', noOfUsers: 7, status: 'Incomplete' },
    { id: 12, name: 'NorthStar Solutions', dateCreated: new Date('2024-05-13'), createdBy: 'Sam Lee', accountManager: 'Sam Lee', noOfUsers: 8, status: 'Approved' },
    { id: 13, name: 'Zenith Partners', dateCreated: new Date('2024-06-06'), createdBy: 'Dan Kim', accountManager: 'Dan Kim', noOfUsers: 4, status: 'Rejected' },
    { id: 14, name: 'Beacon Global', dateCreated: new Date('2024-06-20'), createdBy: 'Paul Young', accountManager: 'Paul Young', noOfUsers: 6, status: 'Review' },
    { id: 15, name: 'Vector Group Ltd', dateCreated: new Date('2024-07-02'), createdBy: 'Rachel Liu', accountManager: 'Rachel Liu', noOfUsers: 5, status: 'Pending Approval' },
    { id: 16, name: 'Frontier Consulting', dateCreated: new Date('2024-07-15'), createdBy: 'Liam Jones', accountManager: 'Liam Jones', noOfUsers: 7, status: 'Incomplete' },
    { id: 17, name: 'Nexus Solutions', dateCreated: new Date('2024-07-29'), createdBy: 'Henry Ford', accountManager: 'Henry Ford', noOfUsers: 10, status: 'Approved' },
    { id: 18, name: 'Atlas Financial Inc', dateCreated: new Date('2024-08-03'), createdBy: 'Jane Austin', accountManager: 'Jane Austin', noOfUsers: 3, status: 'Rejected' },
    { id: 19, name: 'Summit Edge Technologies', dateCreated: new Date('2024-08-18'), createdBy: 'Grace Park', accountManager: 'Grace Park', noOfUsers: 9, status: 'Review' },
    { id: 20, name: 'Apex Innovations', dateCreated: new Date('2024-09-05'), createdBy: 'Mark Wilson', accountManager: 'Mark Wilson', noOfUsers: 6, status: 'Pending Approval' },
    { id: 21, name: 'Prime Vision Corp', dateCreated: new Date('2024-09-17'), createdBy: 'Alexandra Black', accountManager: 'Alexandra Black', noOfUsers: 4, status: 'Incomplete' },
    { id: 22, name: 'Infinity Holdings', dateCreated: new Date('2024-10-01'), createdBy: 'Eric Woods', accountManager: 'Eric Woods', noOfUsers: 8, status: 'Approved' },
    { id: 23, name: 'Impact Advisory Group', dateCreated: new Date('2024-10-14'), createdBy: 'Nina Clark', accountManager: 'Nina Clark', noOfUsers: 6, status: 'Review' },
    { id: 24, name: 'Global Reach LLC', dateCreated: new Date('2024-10-28'), createdBy: 'Bryan Cox', accountManager: 'Bryan Cox', noOfUsers: 5, status: 'Rejected' },
    { id: 25, name: 'Fusion Tech Partners', dateCreated: new Date('2024-11-10'), createdBy: 'Chloe Zhao', accountManager: 'Chloe Zhao', noOfUsers: 10, status: 'Pending Approval' },
    { id: 26, name: 'SilverWave Advisors', dateCreated: new Date('2024-11-23'), createdBy: 'Danny Kim', accountManager: 'Danny Kim', noOfUsers: 7, status: 'Incomplete' },
    { id: 27, name: 'BrightFuture Inc', dateCreated: new Date('2024-12-03'), createdBy: 'Tina Hill', accountManager: 'Tina Hill', noOfUsers: 8, status: 'Approved' },
    { id: 28, name: 'Phoenix Rising Ltd', dateCreated: new Date('2024-12-12'), createdBy: 'Victor Ng', accountManager: 'Victor Ng', noOfUsers: 4, status: 'Rejected' },
    { id: 29, name: 'NextWave Consulting', dateCreated: new Date('2024-12-21'), createdBy: 'Sophie West', accountManager: 'Sophie West', noOfUsers: 9, status: 'Review' },
    { id: 30, name: 'OpenHorizons LLC', dateCreated: new Date('2024-12-31'), createdBy: 'Leonardo Brown', accountManager: 'Leonardo Brown', noOfUsers: 5, status: 'Pending Approval' }
  ];

  displayedColumns: string[] = [
    'id', 'name', 'dateCreated', 'createdBy',
    'accountManager', 'noOfUsers', 'status', 'actions'
  ];

  statusOptions = [
    { value: '', label: 'Any' },
    { value: 'approved', label: 'Approved' },
    { value: 'review', label: 'Review' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'incomplete', label: 'Incomplete' }
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      status: [''],
      searchType: ['name'],
      searchTerm: ['']
    });

    this.dataSource = new MatTableDataSource(this.buyers);
    
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'dateCreated': return new Date(item.dateCreated).getTime();
        case 'noOfUsers': return item.noOfUsers;
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

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    this.showBuyersContent = this.activeTabIndex === 0;
    this.showApproveBuyersContent = this.activeTabIndex === 1;
    this.showManageBuyersContent = this.activeTabIndex === 2;
    this.showApproveRequestContent = this.activeTabIndex === 3;
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

    this.dataSource.data = this.buyers;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.isFiltersApplied = false;
  }

  applyFilters() {
    let filtered = [...this.buyers];
    const filters = this.filterForm.value;

    if (filters.fromDate) {
      filtered = filtered.filter(buyer => 
        buyer.dateCreated >= new Date(filters.fromDate)
      );
    }

    if (filters.toDate) {
      filtered = filtered.filter(buyer => 
        buyer.dateCreated <= new Date(filters.toDate)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(buyer => 
        buyer.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(buyer => {
        if (filters.searchType === 'name') {
          return buyer.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
        } else {
          return buyer.noOfUsers.toString().includes(filters.searchTerm);
        }
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
      case 'approved':
        return 'approved';
      case 'rejected':
        return 'rejected';
      case 'review':
        return 'review';
      case 'pending approval':
        return 'pending-approval';
      case 'incomplete':
        return 'incomplete';
      default:
        return '';
    }
  }
}