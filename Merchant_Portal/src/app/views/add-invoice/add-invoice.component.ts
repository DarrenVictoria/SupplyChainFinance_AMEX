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
    MatIconModule
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

  constructor(private fb: NonNullableFormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

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
      console.log(this.invoiceForm.value);
      // Add your submission logic here
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