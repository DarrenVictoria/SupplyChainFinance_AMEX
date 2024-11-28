import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

interface Merchant {
  requestId: string;
  dateCreated: string;
  merchant: string;
  invoiceNumber: string;
  invoiceAmount: number;
  creditAmount: number;
  productCode: string;
  buyerStatus: string;
  paymentStatus: string;

  approvedBy?: string;
  approvedDate?: string;
  approvalStatus?: 'Approved' | 'Rejected' | 'Pending';
  pendingApprover?: string;
}

@Component({
  selector: 'app-payments',
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
    MatSortModule,
    MatTooltipModule
  ],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
  standalone: true,
})
export class PaymentsComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterForm: FormGroup;
  dataSource: MatTableDataSource<Merchant>;

  // Define options for dropdowns
  statusOptions = [
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Pending Approval', label: 'Pending Approval' }
  ];

  paymentStatusOptions = [
    { value: 'Paid', label: 'Paid' },
    { value: 'Unpaid', label: 'Unpaid' }
  ];

  productCodeOptions = [
    { value: 'ID', label: 'ID' },
    { value: 'RF', label: 'RF' }
  ];

  searchTypeOptions = [
    { value: 'requestId', label: 'Request ID' },
    { value: 'merchant', label: 'Merchant Name' },
    { value: 'invoiceNumber', label: 'Invoice Number' }
  ];

  displayedColumns: string[] = [
    'requestId', 'dateCreated', 'merchant', 'invoiceNumber', 'invoiceAmount',
    'creditAmount', 'productCode', 'buyerStatus', 'paymentStatus', 'actions'
  ];

  merchants: Merchant[] = [
    {
      requestId: 'REQ-CS-576',
      dateCreated: '11/09/2024',
      merchant: 'Compu Smart',
      invoiceNumber: 'INV-001',
      invoiceAmount: 10000.00,
      creditAmount: 9700.00,
      productCode: 'ID',
      buyerStatus: 'Approved',
      paymentStatus: 'Paid',

    },
    {
      requestId: 'REQ-CS-577',
      dateCreated: '11/09/2024',
      merchant: 'Compu Smart',
      invoiceNumber: 'INV-002',
      invoiceAmount: 100000.00,
      creditAmount: 95000.00,
      productCode: 'RF',
      buyerStatus: 'Rejected',
      paymentStatus: 'Unpaid',

    },
    {
      requestId: 'REQ-CS-578',
      dateCreated: '11/10/2024',
      merchant: 'Tech Solutions',
      invoiceNumber: 'INV-003',
      invoiceAmount: 25000.00,
      creditAmount: 24250.00,
      productCode: 'ID',
      buyerStatus: 'Pending Approval',
      paymentStatus: 'Unpaid',

    }
  ];

  constructor(private fb: FormBuilder, private router: Router,
    private dialog: MatDialog) {
    this.filterForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      status: [''],
      approvalStatus: [''],
      productCode: [''],
      searchType: [''],
      searchTerm: ['']
    });

    this.dataSource = new MatTableDataSource(this.merchants);
  }

  ngOnInit() {
    // Subscribe to form value changes to trigger filtering
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300), // Wait 300ms after last event before emitting
        distinctUntilChanged() // Only emit when the current value is different than the last
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters() {
    const filters = this.filterForm.value;
    let filtered = [...this.merchants];

    // Date filter
    if (filters.fromDate && filters.toDate) {
      const fromDate = new Date(filters.fromDate);
      const toDate = new Date(filters.toDate);
      filtered = filtered.filter(merchant => {
        const merchantDate = new Date(merchant.dateCreated);
        return merchantDate >= fromDate && merchantDate <= toDate;
      });
    }

    // Status filters
    if (filters.status) {
      filtered = filtered.filter(merchant => merchant.buyerStatus === filters.status);
    }

    if (filters.approvalStatus) {
      filtered = filtered.filter(merchant => merchant.paymentStatus === filters.approvalStatus);
    }

    // Product Code filter
    if (filters.productCode) {
      filtered = filtered.filter(merchant => merchant.productCode === filters.productCode);
    }

    // Search filter
    if (filters.searchType && filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(merchant => {
        switch (filters.searchType) {
          case 'requestId':
            return merchant.requestId.toLowerCase().includes(searchTerm);
          case 'merchant':
            return merchant.merchant.toLowerCase().includes(searchTerm);
          case 'invoiceNumber':
            return merchant.invoiceNumber.toLowerCase().includes(searchTerm);
          default:
            return true;
        }
      });
    }

    this.dataSource.data = filtered;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Check if any filters are applied
  get isFiltersApplied(): boolean {
    const filters = this.filterForm.value;
    return !!(
      filters.fromDate ||
      filters.toDate ||
      filters.status ||
      filters.approvalStatus ||
      filters.productCode ||
      (filters.searchType && filters.searchTerm)
    );
  }

  resetFilters() {
    this.filterForm.reset();
    this.dataSource.data = this.merchants;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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

  navigateToAddInvoice() {
    this.router.navigate(['/add-invoice']);
  }

  getActionButtons(merchant: Merchant): string {
    if (merchant.paymentStatus === 'Paid') {
      return 'info';
    } else {
      return 'info,card';
    }
  }



  getBuyerStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Pending Approval':
        return 'pending-approval';
      default:
        return '';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'Paid':
        return 'paid';
      case 'Unpaid':
        return 'unpaid';
      default:
        return '';
    }
  }

  generateClientStatement() {
    const filters = this.filterForm.value;

    // Validate date range is selected
    if (!filters.fromDate || !filters.toDate) {
      // You might want to use a snackbar or dialog to show this message
      alert('Please select a date range for the client statement');
      return;
    }

    // Filter merchants based on the date range
    const statementsInRange = this.merchants.filter(merchant => {
      const merchantDate = new Date(merchant.dateCreated);
      const fromDate = new Date(filters.fromDate);
      const toDate = new Date(filters.toDate);
      return merchantDate >= fromDate && merchantDate <= toDate;
    });

    // Generate a simple CSV for demonstration
    this.downloadClientStatement(statementsInRange);
  }

  downloadClientStatement(statements: Merchant[]) {
    // Convert merchant data to CSV
    const headers = [
      'Request ID',
      'Date Created',
      'Merchant',
      'Invoice Number',
      'Invoice Amount',
      'Credit Amount',
      'Product Code',
      'Buyer Status',
      'Payment Status'
    ];

    const csvContent = [
      headers.join(','),
      ...statements.map(merchant => [
        merchant.requestId,
        merchant.dateCreated,
        merchant.merchant,
        merchant.invoiceNumber,
        merchant.invoiceAmount,
        merchant.creditAmount,
        merchant.productCode,
        merchant.buyerStatus,
        merchant.paymentStatus
      ].map(value => `"${value}"`).join(','))
    ].join('\n');

    // Create and download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `client_statement_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}