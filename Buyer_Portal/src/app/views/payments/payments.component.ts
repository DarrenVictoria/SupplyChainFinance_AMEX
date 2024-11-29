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
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

    this.downloadClientStatementPDF(statementsInRange, filters.fromDate, filters.toDate);
  }

  downloadClientStatementPDF(statements: Merchant[], fromDate: Date, toDate: Date) {
    const doc = new jsPDF('landscape');

    // Increase logo size and adjust positioning
    const logoBase64 = 'data:image/png;base64,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'; // Replace with your actual base64 image
    doc.addImage(logoBase64, 'PNG', 10, 10, 40, 35); // Increased width and height

    // Rest of the PDF generation remains the same
    doc.setFontSize(16);
    doc.text(`Payments from ${fromDate.toLocaleDateString()} to ${toDate.toLocaleDateString()}`,
      doc.internal.pageSize.width / 2, 40, { align: 'center' }); // Adjusted Y position

    // Prepare table data
    const tableColumns = [
      'Request ID', 'Date Created', 'Merchant', 'Invoice Number',
      'Invoice Amount', 'Credit Amount', 'Product Code',
      'Buyer Status', 'Payment Status'
    ];

    const tableData = statements.map(merchant => [
      merchant.requestId,
      merchant.dateCreated,
      merchant.merchant,
      merchant.invoiceNumber,
      `$${merchant.invoiceAmount.toFixed(2)}`,
      `$${merchant.creditAmount.toFixed(2)}`,
      merchant.productCode,
      merchant.buyerStatus,
      merchant.paymentStatus
    ]);

    // Add table with adjusted start position
    (doc as any).autoTable({
      startY: 50, // Increased to make room for logo and title
      head: [tableColumns],
      body: tableData,
      theme: 'striped',
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255
      }
    });

    // Save the PDF
    doc.save(`client_statement_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}