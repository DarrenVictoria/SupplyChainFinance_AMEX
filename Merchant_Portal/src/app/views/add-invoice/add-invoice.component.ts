import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import * as Papa from 'papaparse';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface Invoice {
  id?: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  currency: string;
  totalAmount: number;
  paymentTerms: string;
  buyerCode: string;
  buyerName: string;
}

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepicker,
    MatNativeDateModule
  ]
})
export class AddInvoiceComponent implements OnInit {
  @ViewChild('csvFileInput') csvFileInput!: ElementRef;

  invoiceForm: FormGroup;
  verificationInvoices: Invoice[] = [];
  mainInvoices: Invoice[] = [];
  editingInvoice: Invoice | null = null;

  selection = new SelectionModel<Invoice>(true, []);


  currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' }
  ];

  paymentTermsOptions = [
    { value: '30 days', label: '30 days' },
    { value: '60 days', label: '60 days' },
    { value: '90 days', label: '90 days' },
  ];

  buyerCodeOptions = [
    { value: 'B001', label: 'B001', name: 'TechCorp Solutions' },
    { value: 'B002', label: 'B002', name: 'Global Innovations Inc.' },
    { value: 'B003', label: 'B003', name: 'Sunrise Enterprises' },
    { value: 'B004', label: 'B004', name: 'Horizon Trading Co.' },
    { value: 'B005', label: 'B005', name: 'Quantum Industries' },
    { value: 'B006', label: 'B006', name: 'Oceanic Distributors' },
    { value: 'B007', label: 'B007', name: 'Pinnacle Systems' },
    { value: 'B008', label: 'B008', name: 'Nexus Solutions Group' },
    { value: 'B009', label: 'B009', name: 'Evergreen Traders' },
    { value: 'B010', label: 'B010', name: 'Synergy Worldwide' }
  ];

  displayedMainColumns: string[] = [
    'buyerCode',
    'buyerName',
    'invoiceNumber',
    'invoiceDate',
    'dueDate',
    'currency',
    'totalAmount',
    'paymentTerms',
    'actions'
  ];

  displayedColumns: string[] = [
    'select',
    'buyerCode',
    'buyerName',
    'invoiceNumber',
    'invoiceDate',
    'dueDate',
    'currency',
    'totalAmount',
    'paymentTerms',
    'actions'
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.invoiceForm = this.createInvoiceForm();
  }

  ngOnInit() {
    // Listen to buyerCode changes to auto-populate buyerName
    this.invoiceForm.get('buyerCode')?.valueChanges.subscribe(code => {
      const buyer = this.buyerCodeOptions.find(option => option.value === code);
      if (buyer) {
        this.invoiceForm.patchValue({ buyerName: buyer.name }, { emitEvent: false });
      }
    });
  }

  createInvoiceForm(): FormGroup {
    return this.fb.group({
      invoiceNumber: ['', Validators.required],
      invoiceDate: [null, Validators.required],
      dueDate: [null, Validators.required],
      currency: ['', Validators.required],
      totalAmount: [null, [Validators.required, Validators.min(0)]],
      paymentTerms: ['', Validators.required],
      buyerCode: ['', Validators.required],
      buyerName: [{ value: '', disabled: true }]
    });
  }
  triggerFileInput() {
    this.csvFileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          // Reset selection when new file is parsed
          this.selection.clear();

          this.verificationInvoices = (results.data as any[][])
            .slice(1) // Skip header row
            .filter((row: any[]) => row[0] && row[1]) // Require at least merchant name and invoice number
            .map((row: any[]) => this.mapCsvRowToInvoice(row));

          this.snackBar.open(`${this.verificationInvoices.length} Invoices Parsed`, 'Close', { duration: 3000 });
        },
        header: false
      });
    }
  }

  mapCsvRowToInvoice(row: any[]): Invoice {
    const buyerCode = this.validateBuyerCode(row[4] || '');
    const buyerName = this.getBuyerNameFromCode(buyerCode);

    return {
      id: `invoice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber: row[0] || '',
      invoiceDate: new Date(row[1] || Date.now()),
      dueDate: new Date(row[2] || Date.now()),
      currency: this.validateCurrency(row[3] || 'USD'),
      totalAmount: parseFloat(row[5] || '0'),
      paymentTerms: this.validatePaymentTerms(row[6] || 'net30'),
      buyerCode: buyerCode,
      buyerName: buyerName
    };
  }


  validateCurrency(currency: string): string {
    const match = this.currencyOptions.find(option =>
      option.value.toLowerCase() === currency.toLowerCase() ||
      option.label.toLowerCase() === currency.toLowerCase()
    );
    return match ? match.value : 'USD';
  }

  validatePaymentTerms(terms: string): string {
    const match = this.paymentTermsOptions.find(option =>
      option.label.toLowerCase().includes(terms.toLowerCase())
    );
    return match ? match.value : 'net30';
  }

  validateBuyerCode(code: string): string {
    const match = this.buyerCodeOptions.find(option =>
      option.value.toLowerCase() === code.toLowerCase() ||
      option.label.toLowerCase() === code.toLowerCase()
    );
    return match ? match.value : this.buyerCodeOptions[0].value;
  }

  getBuyerNameFromCode(code: string): string {
    const match = this.buyerCodeOptions.find(option => option.value === code);
    return match ? match.name : '';
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.verificationInvoices.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.verificationInvoices.forEach(row => this.selection.select(row));
  }

  addSelectedInvoices() {
    const selectedInvoices = this.selection.selected;
    this.mainInvoices = [...this.mainInvoices, ...selectedInvoices];

    // Remove added invoices from verification table
    this.verificationInvoices = this.verificationInvoices.filter(
      invoice => !selectedInvoices.includes(invoice)
    );

    // Clear selection
    this.selection.clear();

    this.snackBar.open(`${selectedInvoices.length} Invoices Added`, 'Close', { duration: 3000 });
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      const formValue = { ...this.invoiceForm.value, buyerName: this.invoiceForm.get('buyerName')?.value };

      if (this.editingInvoice) {
        // Safely use non-null assertion operator or optional chaining
        const editedInvoiceId = this.editingInvoice.id ||
          `invoice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Update existing invoice
        this.mainInvoices = this.mainInvoices.map(invoice =>
          invoice.id === editedInvoiceId
            ? { ...formValue, id: editedInvoiceId }
            : invoice
        );

        // Reset editing state
        this.editingInvoice = null;
      } else {
        // Add new invoice
        const newInvoice: Invoice = {
          ...formValue,
          id: `invoice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        this.mainInvoices = [...this.mainInvoices, newInvoice];
      }

      // Reset the form
      this.invoiceForm.reset();
    }
  }
  editInvoice(invoice: Invoice) {
    this.editingInvoice = invoice;
    this.invoiceForm.patchValue({
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      currency: invoice.currency,
      totalAmount: invoice.totalAmount,
      paymentTerms: invoice.paymentTerms,
      buyerCode: invoice.buyerCode,
      buyerName: invoice.buyerName
    });
  }

  removeInvoice(invoice: Invoice) {
    this.mainInvoices = this.mainInvoices.filter(inv => inv.id !== invoice.id);
    this.snackBar.open('Invoice removed', 'Close', { duration: 2000 });
  }

  cancelEdit() {
    this.invoiceForm.reset();
    this.editingInvoice = null;
  }
}