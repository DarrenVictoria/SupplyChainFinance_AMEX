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

interface Payment {
  requestId: string;
  dateCreated: Date;
  buyer: string;
  merchant: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  paymentTerms: string;
  invoiceAmount: number;
  creditAmount: number;
  financierReceivables: number;
  program: string;
  actions: string;
}

@Component({
  selector: 'app-payments',
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
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class Payments implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterForm: FormGroup;
  activeTabIndex = 0;
  dataSource: MatTableDataSource<Payment>;
  isFiltersApplied = false;

  showPaymentsContent = true;
  showStructureContent = false;

  payments: Payment[] = [
    {
      requestId: 'REQ-CS-576',
      dateCreated: new Date('2024-11-09'),
      buyer: 'Zulify Holdings',
      merchant: 'Compu Smart',
      invoiceNumber: 'INV-001',
      invoiceDate: new Date('2024-11-01'),
      dueDate: new Date('2024-12-01'),
      paymentTerms: '30 days',
      invoiceAmount: 10000.00,
      creditAmount: 9700.00,
      financierReceivables: 300.00,
      program: 'Program A',
      actions: ''
    },
    {
      requestId: 'REQ-CS-577',
      dateCreated: new Date('2024-11-09'),
      buyer: 'Howings',
      merchant: 'Compu Smart',
      invoiceNumber: 'INV-002',
      invoiceDate: new Date('2024-11-05'),
      dueDate: new Date('2024-12-05'),
      paymentTerms: '60days',
      invoiceAmount: 100000.00,
      creditAmount: 95000.00,
      financierReceivables: 5000.00,
      program: 'Program C',
      actions: ''
    }
  ];

  displayedColumns: string[] = [
    'requestId', 'dateCreated', 'buyer', 'merchant', 'invoiceNumber',
    'invoiceDate', 'dueDate', 'paymentTerms', // Added paymentTerms
    'invoiceAmount', 'creditAmount',
    'financierReceivables', 'program', 'actions'
  ];

  programOptions = [
    { value: '', label: 'Any' },
    { value: 'program a', label: 'Program A' },
    { value: 'program b', label: 'Program B' },
    { value: 'program c', label: 'Program C' }
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      invoiceFromDate: [''],
      invoiceToDate: [''],
      buyer: [''],
      merchant: [''],
      program: [''],
      paymentTerms: [''] // Added paymentTerms filter
    });

    this.dataSource = new MatTableDataSource(this.payments);
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
    this.showPaymentsContent = this.activeTabIndex === 0;
    this.showStructureContent = this.activeTabIndex === 1;
  }

  checkFiltersApplied() {
    const formValues = this.filterForm.value;
    this.isFiltersApplied = !!(
      formValues.fromDate ||
      formValues.toDate ||
      formValues.buyer ||
      formValues.merchant ||
      formValues.program ||
      formValues.paymentTerms // Added paymentTerms
    );
  }


  resetFilters(): void {
    this.filterForm.reset({
      fromDate: '',
      toDate: '',
      buyer: '',
      merchant: '',
      program: '',
      paymentTerms: ''
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

    if (filters.buyer) {
      filtered = filtered.filter(payment =>
        payment.buyer.toLowerCase().includes(filters.buyer.toLowerCase())
      );
    }

    if (filters.merchant) {
      filtered = filtered.filter(payment =>
        payment.merchant.toLowerCase().includes(filters.merchant.toLowerCase())
      );
    }

    if (filters.program) {
      filtered = filtered.filter(payment =>
        payment.program.toLowerCase() === filters.program.toLowerCase()
      );
    }
    if (filters.paymentTerms) {
      filtered = filtered.filter(payment =>
        payment.paymentTerms.toLowerCase().includes(filters.paymentTerms.toLowerCase())
      );
    }

    this.dataSource.data = filtered;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  onInfo(payment: Payment) {
    console.log('Info:', payment);
    // Implement your info logic here
  }

  //Logic behind Financier Receivables for devs - Invoice amount should be more than the Credit amout and the financier recivables should be the (Invoice Amount - Credit Amount)

  validatePayment(payment: Payment): boolean {
    return payment.invoiceAmount > payment.creditAmount && payment.financierReceivables === payment.invoiceAmount - payment.creditAmount;
  }
}