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
  crNumber?: string;
  supplierName: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  currency: string;
  totalAmount: number;
  paymentTerms: string;
}

const CR_NUMBER_MAPPING = {
  'CR001': 'SBC Holdings Pvt Ltd',
  'CR002': 'Janashakthi Pvt Ltd',
  'CR003': 'Emaar Pvt Ltd'
};

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

  supplierOptions = [
    { value: 'SBC Holdings Pvt Ltd', label: 'SBC Holdings Pvt Ltd' },
    { value: 'Janashakthi Pvt Ltd', label: 'Janashakthi Pvt Ltd' },
    { value: 'Emaar Pvt Ltd', label: 'Emaar Pvt Ltd' }
  ];



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

  displayedColumns: string[] = [
    'select',
    'crNumber',
    'supplierName',
    'invoiceNumber',
    'invoiceDate',
    'dueDate',
    'currency',
    'totalAmount',
    'paymentTerms',
    'actions'
  ];

  displayedMainColumns: string[] = [
    'crNumber',
    'supplierName',
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
    // Add event listener for CR Number input
    this.invoiceForm.get('crNumber')?.valueChanges.subscribe(crNumber => {
      if (crNumber) {
        const supplierName = CR_NUMBER_MAPPING[crNumber as keyof typeof CR_NUMBER_MAPPING];
        if (supplierName) {
          this.invoiceForm.get('supplierName')?.setValue(supplierName);
          this.invoiceForm.get('supplierName')?.disable();
        } else {
          this.invoiceForm.get('supplierName')?.enable();
        }
      } else {
        this.invoiceForm.get('supplierName')?.enable();
      }
    });
  }

  createInvoiceForm(): FormGroup {
    return this.fb.group({
      crNumber: ['', Validators.required],
      supplierName: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      invoiceDate: [null, Validators.required],
      dueDate: [null, Validators.required],
      currency: ['', Validators.required],
      totalAmount: [null, [Validators.required, Validators.min(0)]],
      paymentTerms: ['', Validators.required]
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
            .filter((row: any[]) => row[0] && row[1]) // Require at least CR Number and invoice number
            .map((row: any[]) => this.mapCsvRowToInvoice(row));

          this.snackBar.open(`${this.verificationInvoices.length} Invoices Parsed`, 'Close', { duration: 3000 });
        },
        header: false
      });
    }
  }

  mapCsvRowToInvoice(row: any[]): Invoice {
    const crNumber = row[0] || '';
    return {
      id: `invoice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      crNumber: crNumber,
      supplierName: this.validateSupplierName(crNumber),
      invoiceNumber: row[1] || '',
      invoiceDate: new Date(row[2] || Date.now()),
      dueDate: new Date(row[3] || Date.now()),
      currency: this.validateCurrency(row[4] || 'USD'),
      totalAmount: parseFloat(row[5] || '0'),
      paymentTerms: this.validatePaymentTerms(row[6] || 'net30')
    };
  }
  validateSupplierName(crNumber: string): string {
    // Use the CR Number mapping to get the supplier name
    const supplierName = CR_NUMBER_MAPPING[crNumber as keyof typeof CR_NUMBER_MAPPING];
    return supplierName || this.supplierOptions[0].value;
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
      const formValue = this.invoiceForm.value as Invoice;

      if (this.editingInvoice) {
        // Ensure editingInvoice has an id
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
        this.snackBar.open('Invoice updated', 'Close', { duration: 2000 });
      } else {
        // Add new invoice
        const newInvoice: Invoice = {
          ...formValue,
          id: `invoice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        this.mainInvoices = [...this.mainInvoices, newInvoice];
        this.snackBar.open('Invoice added', 'Close', { duration: 2000 });
      }

      // Reset the form
      this.invoiceForm.reset();
    }
  }

  editInvoice(invoice: Invoice) {
    this.editingInvoice = invoice;
    this.invoiceForm.patchValue({
      supplierName: invoice.supplierName,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      currency: invoice.currency,
      totalAmount: invoice.totalAmount,
      paymentTerms: invoice.paymentTerms
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