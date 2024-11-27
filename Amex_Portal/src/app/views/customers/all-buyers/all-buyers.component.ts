import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

interface Buyer {
  id: number;
  name: string;
  retrievedDate: Date;
  hasActiveCampaign: boolean;
  accountManager: string;
}

@Component({
  selector: 'app-all-buyers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSortModule
  ],
  templateUrl: './all-buyers.component.html',
  styleUrls: ['./all-buyers.component.scss']
})
export class AllBuyersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterForm: FormGroup;
  dataSource: MatTableDataSource<Buyer>;
  isFiltersApplied = false;
  selectedBuyer: Buyer | null = null;

  buyers: Buyer[] = [
    { id: 1, name: 'Skyline Innovations LLC', retrievedDate: new Date('2024-01-15'), hasActiveCampaign: true, accountManager: '' },
    { id: 2, name: 'Vanguard Resource Group LP', retrievedDate: new Date('2024-01-17'), hasActiveCampaign: false, accountManager: 'Mark Smith' },
    { id: 3, name: 'Quantum Edge Systems Inc', retrievedDate: new Date('2024-01-21'), hasActiveCampaign: true, accountManager: '' },
    { id: 4, name: 'Pinnacle Data Solutions', retrievedDate: new Date('2024-02-05'), hasActiveCampaign: false, accountManager: 'Mark Smith' },
    { id: 5, name: 'Streamline Ventures', retrievedDate: new Date('2024-02-19'), hasActiveCampaign: true, accountManager: '' },
    { id: 6, name: 'Lighthouse Consulting Group', retrievedDate: new Date('2024-03-01'), hasActiveCampaign: false, accountManager: 'Mark Smith' },
    { id: 7, name: 'Harbor Technologies', retrievedDate: new Date('2024-03-12'), hasActiveCampaign: true, accountManager: '' },
    { id: 8, name: 'Everest Management Ltd', retrievedDate: new Date('2024-03-25'), hasActiveCampaign: false, accountManager: 'Mark Smith' },
    { id: 9, name: 'Orion Global Holdings', retrievedDate: new Date('2024-04-04'), hasActiveCampaign: true, accountManager: '' },
    { id: 10, name: 'Blue Sky Enterprises', retrievedDate: new Date('2024-04-18'), hasActiveCampaign: false, accountManager: 'Mark Smith' }
  ];

  displayedColumns: string[] = [
    'id', 'name', 'retrievedDate', 'actions'
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      searchTerm: ['']
    });

    this.dataSource = new MatTableDataSource(this.buyers);

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'retrievedDate': return new Date(item.retrievedDate).getTime();
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
    this.isFiltersApplied = !!(
      formValues.fromDate ||
      formValues.toDate ||
      formValues.searchTerm
    );
  }

  resetFilters(): void {
    this.filterForm.reset({
      fromDate: '',
      toDate: '',
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
        buyer.retrievedDate >= new Date(filters.fromDate)
      );
    }

    if (filters.toDate) {
      filtered = filtered.filter(buyer =>
        buyer.retrievedDate <= new Date(filters.toDate)
      );
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(buyer =>
        buyer.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        buyer.id.toString().includes(filters.searchTerm)
      );
    }

    this.dataSource.data = filtered;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onViewMore(buyer: Buyer) {
    // Implement view more logic
    console.log('View more details for buyer:', buyer);
  }

  onTakeBuyer(buyer: Buyer) {
    // Implement take buyer logic
    console.log('Take buyer:', buyer);
  }

  popupPosition = { top: 0, left: 0 }; // Store the position for the popup


  openAccountManagerPopup(event: MouseEvent, buyer: any): void {
    const button = event.target as HTMLElement;
    const buttonRect = button.getBoundingClientRect();

    this.popupPosition = {
      top: buttonRect.top + buttonRect.height + window.scrollY, // Adjust for scrolling
      left: buttonRect.left + window.scrollX, // Adjust for scrolling
    };

    this.selectedBuyer = buyer; // Set the selected buyer
  }

  closeAccountManagerPopup(): void {
    this.selectedBuyer = null; // Close the popup
  }

}

