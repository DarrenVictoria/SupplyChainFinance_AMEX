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

interface Buyer {
  name: string;
  invoices: Invoice[];
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
    MatIconModule,

  ]
})
export class AddInvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;

  buyerOptions = [
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

  constructor(
    private fb: NonNullableFormBuilder,
    private snackBar: MatSnackBar,
    private invoiceDataService: InvoiceDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
  }

  // CSV Upload Method
  onCsvUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

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

          this.populateFormFromCsv(results.data);
        }
      });
    }
  }

  populateFormFromCsv(data: any[]) {
    // Clear existing form
    while (this.buyersArray.length !== 0) {
      this.buyersArray.removeAt(0);
    }

    // Group invoices by buyer
    const buyerGroups = this.groupInvoicesByBuyer(data);

    // Populate form
    buyerGroups.forEach(buyerInvoices => {
      const buyerGroup = this.createBuyerGroup();

      // Try to match the buyer name with predefined options
      const buyerName = buyerInvoices[0].buyerName || '';
      const matchedBuyer = this.buyerOptions.find(option =>
        option.label.toLowerCase().includes(buyerName.toLowerCase())
      );

      // Set buyer name with matched value or default
      buyerGroup.get('buyerName')?.setValue(
        matchedBuyer ? matchedBuyer.value : ''
      );

      // Create invoice groups
      const invoicesArray = buyerGroup.get('invoices') as FormArray;
      invoicesArray.clear(); // Remove default invoice

      buyerInvoices.forEach((invoice: any) => {
        const invoiceGroup = this.createInvoiceGroup();

        invoiceGroup.patchValue({
          invoiceNumber: invoice.invoiceNumber || '',
          invoiceDate: new Date(invoice.invoiceDate || Date.now()),
          dueDate: new Date(invoice.dueDate || Date.now()),
          currency: this.validateCurrency(invoice.currency),
          totalAmount: parseFloat(invoice.totalAmount || 0),
          paymentTerms: this.validatePaymentTerms(invoice.paymentTerms)
        });

        invoicesArray.push(invoiceGroup);
      });

      this.buyersArray.push(buyerGroup);
    });
  }

  // Helper method to group invoices by buyer
  groupInvoicesByBuyer(data: any[]): any[][] {
    const buyerMap = new Map<string, any[]>();

    data.forEach(invoice => {
      const buyerKey = invoice.buyerName;
      if (!buyerMap.has(buyerKey)) {
        buyerMap.set(buyerKey, []);
      }
      buyerMap.get(buyerKey)?.push(invoice);
    });

    return Array.from(buyerMap.values());
  }

  // Validation helpers
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

  // Existing form methods (createBuyerGroup, createInvoiceGroup, etc.)
  initForm() {
    this.invoiceForm = this.fb.group({
      buyers: this.fb.array([this.createBuyerGroup()])
    });
  }

  createBuyerGroup(): FormGroup {
    return this.fb.group({
      buyerName: ['', Validators.required],
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

  get buyersArray(): FormArray {
    return this.invoiceForm.get('buyers') as FormArray;
  }



  getBuyersInvoicesArray(buyerIndex: number): FormArray {
    const buyerGroup = this.buyersArray.at(buyerIndex);
    return buyerGroup.get('invoices') as FormArray;
  }

  addBuyer() {
    this.buyersArray.push(this.createBuyerGroup());
  }

  addInvoice(buyerIndex: number) {
    this.getBuyersInvoicesArray(buyerIndex).push(this.createInvoiceGroup());
  }

  removeBuyer(buyerIndex: number) {
    if (this.buyersArray.length > 1) {
      this.buyersArray.removeAt(buyerIndex);
    }
  }

  removeInvoice(buyerIndex: number, invoiceIndex: number) {
    const invoicesArray = this.getBuyersInvoicesArray(buyerIndex);
    if (invoicesArray.length > 1) {
      invoicesArray.removeAt(invoiceIndex);
    }
  }

  onFileSelected(event: Event, buyerIndex: number, invoiceIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.getBuyersInvoicesArray(buyerIndex)
        .at(invoiceIndex)
        .get('attachment')
        ?.setValue(file);
    }
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      const formValue = this.invoiceForm.value;

      // Send data to the service
      this.invoiceDataService.updateInvoiceData(formValue.buyers);

      // Show success message
      this.snackBar.open('Invoices added successfully', 'Close', { duration: 3000 });

      // Navigate to invoices page
      this.router.navigate(['/invoices']);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.invoiceForm);
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
}