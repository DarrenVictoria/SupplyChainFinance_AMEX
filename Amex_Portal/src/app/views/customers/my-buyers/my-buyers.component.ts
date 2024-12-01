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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditCreditLimitPopupComponent } from './edit-credit-limit-popup/edit-credit-limit-popup.component';


interface Buyer {
  id: number;
  name: string;
  dateCreated: Date;
  noOfUsers: number;
  status: string;
  creditLimit: number;
}

@Component({
  selector: 'app-my-buyers',
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
    MatSortModule,
    MatDialogModule,
    EditCreditLimitPopupComponent,
  ],
  templateUrl: './my-buyers.component.html',
  styleUrls: ['./my-buyers.component.css']
})
export class MyBuyersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(EditCreditLimitPopupComponent) editCreditLimitPopup!: EditCreditLimitPopupComponent;


  filterForm: FormGroup;
  activeTabIndex = 0;
  dataSource: MatTableDataSource<Buyer>;
  isFiltersApplied = false;

  showBuyersContent = true;
  showApproveBuyersContent = false;
  showManageBuyersContent = false;
  showApproveRequestContent = false;

  buyers: Buyer[] = [
    { id: 1, name: 'Silverline Innovations LLC', dateCreated: new Date('2024-11-09'), noOfUsers: 5, status: 'Active', creditLimit: 50000 },
    { id: 2, name: 'Vanguard Resource Group LP', dateCreated: new Date('2024-11-09'), noOfUsers: 4, status: 'Inactive', creditLimit: 75000 },
    { id: 3, name: 'Quantum Edge Systems Inc', dateCreated: new Date('2024-11-09'), noOfUsers: 6, status: 'Active', creditLimit: 100000 },
    { id: 4, name: 'Maple Leaf Consulting', dateCreated: new Date('2024-11-09'), noOfUsers: 8, status: 'Active', creditLimit: 25000 },
    { id: 5, name: 'Blue Horizon Ventures LLC', dateCreated: new Date('2024-11-09'), noOfUsers: 7, status: 'Inactive', creditLimit: 150000 },
    { id: 6, name: 'Golden Path Marketing', dateCreated: new Date('2024-11-09'), noOfUsers: 9, status: 'Active', creditLimit: 80000 }
  ];

  displayedColumns: string[] = [
    'id', 'name', 'dateCreated', 'noOfUsers', 'creditLimit', 'status', 'actions'
  ];

  statusOptions = [
    { value: '', label: 'Any' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      status: [''],
      searchType: ['name'],
      searchTerm: ['']
    });

    this.dataSource = new MatTableDataSource(this.buyers);
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;

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

  sortingDataAccessor = (item: Buyer, property: string) => {
    switch (property) {
      case 'dateCreated': return new Date(item.dateCreated).getTime();
      case 'noOfUsers': return item.noOfUsers;
      case 'creditLimit': return item.creditLimit;
      default: return (item as any)[property];
    }
  };

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
      case 'active':
        return 'approved';
      case 'inactive':
        return 'rejected';
      default:
        return '';
    }
  }

  openEditCreditLimitPopup(buyer: Buyer) {
    const dialogRef = this.dialog.open(EditCreditLimitPopupComponent, {
      width: '400px',
      data: { currentCreditLimit: buyer.creditLimit }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        buyer.creditLimit = result;
        this.dataSource.data = [...this.dataSource.data];
      }
    });
  }



}