import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterLink, RouterModule } from '@angular/router';
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
import { InvoiceDataService, InvoiceData } from '../../services/invoice-data.service';

interface Merchant {
  requestId: string;
  dateCreated: string;
  buyerName: string;
  merchantStatus: string;
  invoiceNumber: string;
  invoiceAmount: number;
  creditAmount: number;
  productCode: string;
  buyerStatus: string;
  paymentStatus: string;
  paymentTerms: '30 days' | '60 days' | '90 days';
  approvedBy?: string;
  approvedDate?: string;
  approvalStatus?: 'Approved' | 'Rejected' | 'Pending';
  pendingApprover?: string;
}

@Component({
  selector: 'app-invoices',
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
    MatTooltipModule,
    RouterModule,
    RouterLink
  ],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
  standalone: true,
})
export class InvoicesComponent implements AfterViewInit, OnInit {
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

  merchantStatusOptions = [
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Pending Approval', label: 'Pending Approval' }
  ];

  // Update search type options
  searchTypeOptions = [
    { value: 'requestId', label: 'Request ID' },
    { value: 'buyerName', label: 'Buyer Name' }, // Changed from merchant
    { value: 'invoiceNumber', label: 'Invoice Number' }
  ];

  // Update displayed columns
  displayedColumns: string[] = [
    'requestId', 'dateCreated', 'buyerName',
    'invoiceNumber', 'paymentTerms', 'invoiceAmount', 'creditAmount',
    'merchantStatus', 'buyerStatus', 'paymentStatus', 'actions'
  ];

  paymentTermsOptions = [
    { value: '30 days', label: '30 Days' },
    { value: '60 days', label: '60 Days' },
    { value: '90 days', label: '90 Days' }
  ];

  // Update sample data
  merchants: Merchant[] = [
    {
      requestId: 'REQ-CS-576',
      dateCreated: '11/09/2024',
      buyerName: 'Skyline Innovations',
      merchantStatus: 'Approved',
      invoiceNumber: 'INV-001',
      invoiceAmount: 10000.00,
      creditAmount: 9700.00,
      productCode: 'ID',
      buyerStatus: 'Approved',
      paymentStatus: 'Paid',
      approvedBy: 'John Smith',
      approvedDate: '11/09/2024 14:30 EST',
      approvalStatus: 'Approved',
      paymentTerms: '30 days',
    },
    {
      requestId: 'REQ-SBC-782',
      dateCreated: '12/15/2024',
      buyerName: 'Vanguard Resources',
      merchantStatus: 'Pending Approval',
      invoiceNumber: 'INV-002',
      invoiceAmount: 15500.50,
      creditAmount: 15035.00,
      productCode: 'RF',
      buyerStatus: 'Pending Approval',
      paymentStatus: 'Unpaid',
      pendingApprover: 'Michael Chen',
      approvalStatus: 'Pending',
      paymentTerms: '30 days',
    },
    {
      requestId: 'REQ-EMAAR-345',
      dateCreated: '01/22/2024',
      buyerName: 'Streamline Ventures',
      merchantStatus: 'Rejected',
      invoiceNumber: 'INV-003',
      invoiceAmount: 7800.25,
      creditAmount: 7566.00,
      productCode: 'ID',
      buyerStatus: 'Rejected',
      paymentStatus: 'Unpaid',
      approvedBy: 'Emily Davis',
      approvedDate: '01/23/2024 09:15 EST',
      approvalStatus: 'Rejected',
      paymentTerms: '30 days',
    },
    {
      requestId: 'REQ-JANA-619',
      dateCreated: '02/05/2024',
      buyerName: 'Pinnacle Data ',
      merchantStatus: 'Approved',
      invoiceNumber: 'INV-004',
      invoiceAmount: 22000.75,
      creditAmount: 21340.00,
      productCode: 'RF',
      buyerStatus: 'Approved',
      paymentStatus: 'Paid',
      approvedBy: 'David Wilson',
      approvedDate: '02/06/2024 11:45 EST',
      approvalStatus: 'Approved',
      paymentTerms: '30 days',
    },
    {
      requestId: 'REQ-SBC-890',
      dateCreated: '03/18/2024',
      buyerName: 'Quantum Edge',
      merchantStatus: 'Pending Approval',
      invoiceNumber: 'INV-005',
      invoiceAmount: 5600.00,
      creditAmount: 5432.00,
      productCode: 'ID',
      buyerStatus: 'Pending Approval',
      paymentStatus: 'Unpaid',
      pendingApprover: 'Lisa Martinez',
      approvalStatus: 'Pending',
      paymentTerms: '30 days',
    }
  ];

  constructor(
    private fb: FormBuilder,
    private invoiceDataService: InvoiceDataService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      status: [''],
      approvalStatus: [''],
      productCode: [''],
      paymentTerms: [''],
      merchantStatus: [''],
      searchType: [''],
      searchTerm: ['']
    });

    this.dataSource = new MatTableDataSource(this.merchants);
  }

  ngOnInit() {
    // Subscribe to invoice data service
    this.invoiceDataService.currentInvoiceData.subscribe(
      invoices => {
        // Merge existing merchants with new invoices
        const updatedMerchants = [
          ...this.merchants,
          ...invoices.map(invoice => ({
            ...invoice,
            merchantStatus: invoice.merchantStatus || 'Pending Approval',
            paymentTerms: invoice.paymentTerms as '30 days' | '60 days' | '90 days'
          }))
        ];

        // Update merchants array
        this.merchants = updatedMerchants;

        // Update data source
        this.dataSource.data = updatedMerchants;
      }
    );

    // Existing filter subscription
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
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



    // Merchant Status filter
    if (filters.merchantStatus) {
      filtered = filtered.filter(merchant => merchant.merchantStatus === filters.merchantStatus);
    }

    // Search filter
    if (filters.searchType && filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(merchant => {
        switch (filters.searchType) {
          case 'requestId':
            return merchant.requestId.toLowerCase().includes(searchTerm);
          case 'buyerName': // Changed from merchant
            return merchant.buyerName.toLowerCase().includes(searchTerm);
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
      filters.merchantStatus || // New filter
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
    if (merchant.buyerStatus === 'Approved' || merchant.buyerStatus === 'Rejected') {
      return 'info';
    } else {
      return 'approve,reject,info';
    }
  }

  getApprovalDetails(merchant: Merchant): string {
    switch (merchant.approvalStatus) {
      case 'Approved':
        return `
          Approval Details
          Approved by: ${merchant.approvedBy}
          Date: ${merchant.approvedDate}
        `;
      case 'Rejected':
        return `
          Rejection Details
          Rejected by: ${merchant.approvedBy}
          Date: ${merchant.approvedDate}
        `;
      case 'Pending':
        return `
          Pending Details
          Awaiting approval: ${merchant.pendingApprover}
        `;
      default:
        return '';
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

  getMerchantStatusClass(status: string): string {
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
}