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

interface Merchant {
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

  constructor(private fb: NonNullableFormBuilder) { }

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