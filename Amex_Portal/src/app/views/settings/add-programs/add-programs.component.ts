import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-add-programs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    RouterModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './add-programs.component.html',
  styleUrls: ['./add-programs.component.scss']
})
export class AddProgramsComponent implements OnInit {
  programForm: FormGroup;
  productTypes = ['Approve Invoice Factoring', 'Direct Payment'];
  supplierNames = ['Supplier 1', 'Supplier 2', 'Supplier 3'];
  supplierExceptionsColumns = ['name', 'dailyRate', 'actions'];
  supplierExceptionsDataSource = new MatTableDataSource<FormGroup>([]);

  constructor(private fb: FormBuilder) {
    this.programForm = this.createForm();
  }

  ngOnInit() {
    // Update datasource when supplier exceptions change
    this.programForm.get('supplierExceptions')?.valueChanges.subscribe(() => {
      this.updateSupplierExceptionsDataSource();
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      programName: ['', Validators.required],
      productTypes: [[], Validators.required],

      // Invoice Factoring Specific Fields
      dailyRateFactoring: [null, [Validators.min(0), Validators.max(100)]],
      profitSharingWithBuyers: [null, [Validators.min(0), Validators.max(100)]],
      supplierExceptions: this.fb.array([]),
      enableAutoFinancing: [false],

      // Direct Payment Specific Fields
      dailyRateDirect: [null, [Validators.min(0), Validators.max(100)]],
      gracePeriod: [null, [Validators.min(0)]],
      enableInvoiceRedirection: [false],
      invoiceRedirectionTimeLimit: [24, [Validators.min(1), Validators.max(168)]], // Max 1 week

      // Common Fields
      monthlySupplierSubscriptionFee: [null, [Validators.min(0)]],
      monthlyBuyerSubscriptionFee: [null, [Validators.min(0)]],

      invoiceAmountMin: [null, [Validators.min(0)]],
      invoiceAmountMax: [null, [Validators.min(0)]],

      financingDaysMin: [null, [Validators.min(0)]],
      financingDaysMax: [null, [Validators.min(0)]],
    });
  }

  getFormControl(name: string): AbstractControl | null {
    return this.programForm.get(name);
  }

  getFormArray(name: string): FormArray | null {
    const control = this.programForm.get(name);
    return control instanceof FormArray ? control : null;
  }

  isProductTypeSelected(type: string): boolean {
    const selectedTypes = this.programForm.get('productTypes')?.value || [];
    return selectedTypes.includes(type);
  }

  addSupplierException() {
    const supplierExceptions = this.getFormArray('supplierExceptions');
    if (!supplierExceptions) return;

    const newException = this.fb.group({
      name: new FormControl('', Validators.required),
      dailyRate: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)])
    });

    supplierExceptions.push(newException);
    this.updateSupplierExceptionsDataSource();
  }

  removeSupplierException(index: number) {
    const supplierExceptions = this.getFormArray('supplierExceptions');
    if (!supplierExceptions) return;

    supplierExceptions.removeAt(index);
    this.updateSupplierExceptionsDataSource();
  }

  updateSupplierExceptionsDataSource() {
    const supplierExceptions = this.getFormArray('supplierExceptions');
    if (supplierExceptions) {
      this.supplierExceptionsDataSource.data = supplierExceptions.controls as FormGroup[];
    }
  }

  getSupplierExceptionNameControl(index: number): FormControl {
    const supplierExceptions = this.getFormArray('supplierExceptions');
    if (!supplierExceptions) {
      throw new Error('Supplier Exceptions FormArray not found');
    }

    const exceptionGroup = supplierExceptions.at(index);
    const nameControl = exceptionGroup.get('name');

    if (!(nameControl instanceof FormControl)) {
      throw new Error('Name control not found or not a FormControl');
    }

    return nameControl;
  }

  getSupplierExceptionDailyRateControl(index: number): FormControl {
    const supplierExceptions = this.getFormArray('supplierExceptions');
    if (!supplierExceptions) {
      throw new Error('Supplier Exceptions FormArray not found');
    }

    const exceptionGroup = supplierExceptions.at(index);
    const dailyRateControl = exceptionGroup.get('dailyRate');

    if (!(dailyRateControl instanceof FormControl)) {
      throw new Error('Daily Rate control not found or not a FormControl');
    }

    return dailyRateControl;
  }

  onSubmit() {
    if (this.programForm.valid) {
      console.log(this.programForm.value);
      // Add your submit logic here
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.programForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }

      if (control instanceof FormArray) {
        (control as FormArray).controls.forEach((c) => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          }
        });
      }
    });
  }
}