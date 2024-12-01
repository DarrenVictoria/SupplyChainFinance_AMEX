import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  NonNullableFormBuilder
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Papa from 'papaparse';
import { Router } from '@angular/router';
import { InvoiceDataService } from '../../services/invoice-data.service';

interface Merchant {
  name: string;
  invoices: Invoice[];
}

interface CsvInvoiceRow {
  merchantName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  totalAmount: string;
  paymentTerms: string;
}


interface Invoice {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  currency: string;
  totalAmount: number;
  paymentTerms: string;
  attachment?: File | null;
}

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ]
})
export class AddInvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private snackBar: MatSnackBar,
    private invoiceDataService: InvoiceDataService, // Inject the service
    private router: Router // Inject Router
  ) { }

  cardNumber = '37XX XXXXXX XXXXX';
  creditLimit = 600000;
  availableCredit = 200000;

  merchantOptions = [
    { value: 'sbc', label: 'SBC Holdings Pvt Ltd' },
    { value: 'jana', label: 'Janashakthi Pvt Ltd' },
    { value: 'emaar', label: 'Emaar Pvt Ltd' }
  ];

  currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' }
  ];

  paymentTermsOptions = [
    { value: 'net30', label: 'Net 30 - Payment due within 30 days of invoice date' },
    { value: 'prepaid', label: 'Prepaid - Full payment required upfront before work begins' },
    { value: '50depositnet15', label: '50% Deposit, Net 15 - 50% deposit due upfront, remaining balance due within 15 days' },
    { value: 'progressbilling', label: 'Progress Billing - Payments due at specific milestones or project phases' }
  ];



  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.invoiceForm = this.fb.group({
      merchants: this.fb.array([this.createMerchantGroup()])
    });
  }

  createMerchantGroup(): FormGroup {
    return this.fb.group({
      merchantName: ['', Validators.required],
      invoices: this.fb.array([this.createInvoiceGroup()])
    });
  }

  createInvoiceGroup(): FormGroup {
    return this.fb.group({
      invoiceNumber: ['', Validators.required],
      invoiceDate: [null as any, Validators.required],
      dueDate: [null as any, Validators.required],
      currency: ['', Validators.required],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      paymentTerms: ['', Validators.required],
      attachment: [null]
    });
  }

  get merchantsArray(): FormArray {
    return this.invoiceForm.get('merchants') as FormArray;
  }

  getMerchantsInvoicesArray(merchantIndex: number): FormArray {
    const merchantGroup = this.merchantsArray.at(merchantIndex);
    return merchantGroup.get('invoices') as FormArray;
  }

  // CSV Upload Method
  onCsvUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (!file.name.endsWith('.csv')) {
        this.snackBar.open('Please upload a CSV file', 'Close', { duration: 3000 });
        return;
      }

      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            this.snackBar.open('Error parsing CSV', 'Close', { duration: 3000 });
            console.error(results.errors);
            return;
          }

          this.populateFormFromCsv(results.data as CsvInvoiceRow[]);
        }
      });
    }
  }

  populateFormFromCsv(data: CsvInvoiceRow[]) {
    // Clear existing form
    while (this.merchantsArray.length !== 0) {
      this.merchantsArray.removeAt(0);
    }

    // Group invoices by merchant
    const merchantGroups = this.groupInvoicesByMerchant(data);

    // Populate form
    merchantGroups.forEach(merchantInvoices => {
      const merchantGroup = this.createMerchantGroup();

      // Set merchant name
      merchantGroup.get('merchantName')?.setValue(
        this.validateMerchantName(merchantInvoices[0].merchantName)
      );

      // Create invoice groups
      const invoicesArray = merchantGroup.get('invoices') as FormArray;
      invoicesArray.clear(); // Remove default invoice

      merchantInvoices.forEach(invoice => {
        const invoiceGroup = this.createInvoiceGroup();

        invoiceGroup.patchValue({
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: new Date(invoice.invoiceDate),
          dueDate: new Date(invoice.dueDate),
          currency: this.validateCurrency(invoice.currency),
          totalAmount: parseFloat(invoice.totalAmount),
          paymentTerms: this.validatePaymentTerms(invoice.paymentTerms)
        });

        invoicesArray.push(invoiceGroup);
      });

      this.merchantsArray.push(merchantGroup);
    });
  }

  // Validation helpers
  validateMerchantName(name: string): string {
    const match = this.merchantOptions.find(option =>
      option.label.toLowerCase().includes(name.toLowerCase())
    );
    return match ? match.value : '';
  }

  validateCurrency(currency: string): string {
    const match = this.currencyOptions.find(option =>
      option.value.toLowerCase() === currency.toLowerCase() ||
      option.label.toLowerCase() === currency.toLowerCase()
    );
    return match ? match.value : 'USD'; // Default to USD
  }

  validatePaymentTerms(terms: string): string {
    const match = this.paymentTermsOptions.find(option =>
      option.label.toLowerCase().includes(terms.toLowerCase())
    );
    return match ? match.value : 'net30'; // Default to Net 30
  }

  // Group invoices by merchant name to support multiple invoices per merchant
  groupInvoicesByMerchant(data: CsvInvoiceRow[]): CsvInvoiceRow[][] {
    const merchantMap = new Map<string, CsvInvoiceRow[]>();

    data.forEach(invoice => {
      const merchantKey = invoice.merchantName;
      if (!merchantMap.has(merchantKey)) {
        merchantMap.set(merchantKey, []);
      }
      merchantMap.get(merchantKey)?.push(invoice);
    });

    return Array.from(merchantMap.values());
  }







  addMerchant() {
    this.merchantsArray.push(this.createMerchantGroup());
  }

  addInvoice(merchantIndex: number) {
    this.getMerchantsInvoicesArray(merchantIndex).push(this.createInvoiceGroup());
  }

  removeMerchant(merchantIndex: number) {
    if (this.merchantsArray.length > 1) {
      this.merchantsArray.removeAt(merchantIndex);
    }
  }

  removeInvoice(merchantIndex: number, invoiceIndex: number) {
    const invoicesArray = this.getMerchantsInvoicesArray(merchantIndex);
    if (invoicesArray.length > 1) {
      invoicesArray.removeAt(invoiceIndex);
    }
  }

  onFileSelected(event: Event, merchantIndex: number, invoiceIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.getMerchantsInvoicesArray(merchantIndex)
        .at(invoiceIndex)
        .get('attachment')
        ?.setValue(file);
    }
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      const formValue = this.invoiceForm.value;

      // Send data to the service
      this.invoiceDataService.updateInvoiceData(formValue.merchants);

      // Show success message
      this.snackBar.open('Invoices added successfully', 'Close', { duration: 3000 });

      // Navigate to invoices page
      this.router.navigate(['/invoices']);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.invoiceForm);
    }
  }
}