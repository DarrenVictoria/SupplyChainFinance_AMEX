import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import {
  SupplierManagementService,
  Supplier
} from '../../../services/supplier-management.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-manage-suppliers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
  ],
  template: `
    <div class="manage-suppliers-container">
      <h1>Manage Suppliers</h1>

      <!-- Existing Suppliers Table -->
      <mat-table [dataSource]="(suppliers$ | async) || []" class="suppliers-table">
        <ng-container matColumnDef="crNumber">
          <mat-header-cell *matHeaderCellDef>CR Number</mat-header-cell>
          <mat-cell *matCellDef="let supplier">{{ supplier.crNumber }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="supplierName">
          <mat-header-cell *matHeaderCellDef>Supplier Name</mat-header-cell>
          <mat-cell *matCellDef="let supplier">{{ supplier.supplierName }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="contactName">
          <mat-header-cell *matHeaderCellDef>Contact Name</mat-header-cell>
          <mat-cell *matCellDef="let supplier">{{ supplier.pointOfContact.name }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="email">
          <mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
          <mat-cell *matCellDef="let supplier">{{ supplier.pointOfContact.email }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="phone">
          <mat-header-cell *matHeaderCellDef>Phone</mat-header-cell>
          <mat-cell *matCellDef="let supplier">{{ supplier.pointOfContact.phone }}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
          <mat-cell *matCellDef="let supplier">
            <button mat-icon-button color="primary" (click)="editSupplier(supplier)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteSupplier(supplier.crNumber)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </mat-table>

      <!-- CSV Upload Section -->
      <div class="csv-upload-section">
  <button 
    mat-raised-button 
    color="primary" 
    type="button" 
    class="csv-upload-btn"
    (click)="triggerFileInput()"
  >
    <mat-icon>upload_file</mat-icon>
    Upload CSV
  </button>
</div>

      <!-- Parsed Suppliers Preview Table -->
      <div *ngIf="parsedSuppliers.length > 0" class="parsed-suppliers-section">
        <h2>CSV Preview: {{ parsedSuppliers.length }} Suppliers</h2>
        <p style="color:red">* Note all of these added suppliers will be sent a mail of invitation</p>
        <mat-table [dataSource]="parsedSuppliers" class="parsed-suppliers-table">
          <ng-container matColumnDef="select">
            <mat-header-cell *matHeaderCellDef>
              <mat-checkbox 
                (change)="$event ? masterToggle() : null"
                [checked]="selection.hasValue() && isAllSelected()"
                [indeterminate]="selection.hasValue() && !isAllSelected()"
              >
              </mat-checkbox>
            </mat-header-cell>
            <mat-cell *matCellDef="let row">
              <mat-checkbox 
                (click)="$event.stopPropagation()"
                (change)="$event ? selection.toggle(row) : null"
                [checked]="selection.isSelected(row)"
              >
              </mat-checkbox>
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="crNumber">
            <mat-header-cell *matHeaderCellDef>CR Number</mat-header-cell>
            <mat-cell *matCellDef="let supplier">{{ supplier.crNumber }}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="supplierName">
            <mat-header-cell *matHeaderCellDef>Supplier Name</mat-header-cell>
            <mat-cell *matCellDef="let supplier">{{ supplier.supplierName }}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="contactName">
            <mat-header-cell *matHeaderCellDef>Contact Name</mat-header-cell>
            <mat-cell *matCellDef="let supplier">{{ supplier.pointOfContact.name }}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="email">
            <mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
            <mat-cell *matCellDef="let supplier">{{ supplier.pointOfContact.email }}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="phone">
            <mat-header-cell *matHeaderCellDef>Phone</mat-header-cell>
            <mat-cell *matCellDef="let supplier">{{ supplier.pointOfContact.phone }}</mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="previewColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: previewColumns;"></mat-row>
        </mat-table>

        <div class="parsed-suppliers-actions">
          <button 
            mat-raised-button 
            color="primary" 
            (click)="addSelectedSuppliers()"
            [disabled]="!selection.hasValue()"
          >
            Add Selected Suppliers
          </button>
        </div>
      </div>

      <!-- Supplier Form -->
      <form [formGroup]="supplierForm" (ngSubmit)="onSubmit()" class="supplier-form">
        <h2>Add Supplier</h2>

        <!-- CR Number -->
        <mat-form-field>
          <mat-label>CR Number</mat-label>
          <input matInput formControlName="crNumber" placeholder="CR-SIL00100">
          <mat-error *ngIf="supplierForm.get('crNumber')?.invalid">
            CR Number is required
          </mat-error>
        </mat-form-field>

        <!-- Supplier Name -->
        <mat-form-field>
          <mat-label>Supplier Name</mat-label>
          <input matInput formControlName="supplierName" required>
          <mat-error *ngIf="supplierForm.get('supplierName')?.invalid">
            Supplier Name is required
          </mat-error>
        </mat-form-field>

        <!-- Point of Contact Section -->
        <div formGroupName="pointOfContact">
          <mat-form-field>
            <mat-label>Contact Name</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email">
            <mat-error *ngIf="supplierForm.get('pointOfContact.email')?.invalid">
              Invalid email format
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" placeholder="(123) 456-7890">
          </mat-form-field>
        </div>

        <!-- Address Section -->
        <div formGroupName="address">
          <mat-form-field>
            <mat-label>Street</mat-label>
            <input matInput formControlName="street">
          </mat-form-field>

          <mat-form-field>
            <mat-label>City</mat-label>
            <input matInput formControlName="city">
          </mat-form-field>

          <mat-form-field>
            <mat-label>State</mat-label>
            <input matInput formControlName="state">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Postal Code</mat-label>
            <input matInput formControlName="postalCode">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Country</mat-label>
            <input matInput formControlName="country">
          </mat-form-field>
        </div>

        <!-- CSV Upload Section -->
        <div class="csv-upload-section">
          <input 
            type="file" 
            #csvFileInput 
            (change)="onFileSelected($event)" 
            accept=".csv"
            style="display: none;"
          >
          
        </div>

        <button 
          mat-raised-button 
          color="primary" 
          type="submit" 
          [disabled]="supplierForm.invalid"
        >
          Add Supplier
        </button>
      </form>
    </div>
  `,
  styles: [`
    .manage-suppliers-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .suppliers-table, .parsed-suppliers-table {
      width: 100%;
      margin-bottom: 30px;
    }

    .parsed-suppliers-section {
      background-color: #f0f0f0;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .parsed-suppliers-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
    }

    .supplier-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .supplier-form mat-form-field {
      width: 100%;
    }

    .supplier-form > div {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }

    .supplier-form > div > mat-form-field {
      flex: 1 1 calc(33% - 15px);
      min-width: 250px;
    }

    .csv-upload-section {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-top: 15px;
    }

    @media (max-width: 768px) {
      .supplier-form > div > mat-form-field {
        flex: 1 1 100%;
      }
    }

  .csv-upload-section {
  display: flex;
  justify-content: flex-end;  
  margin-top: 15px;
}

.csv-upload-btn {
  background-color: #1976d2;  
  color: white;
  padding: 4px 10px;  
  max-width: 300px;   
  font-size: 0.8rem;  
  height: 32px;    
  margin-left:80%;  
}

    
  `]
})
export class ManageSupplierComponent implements OnInit {
  @ViewChild('csvFileInput') csvFileInput!: ElementRef;

  supplierForm: FormGroup;
  suppliers$: Observable<Supplier[]>;
  parsedSuppliers: Supplier[] = [];
  editingSupplier: Supplier | null = null;
  selection = new SelectionModel<Supplier>(true, []);

  displayedColumns: string[] = [
    'crNumber',
    'supplierName',
    'contactName',
    'email',
    'phone',
    'actions'
  ];

  previewColumns: string[] = [
    'select',
    'crNumber',
    'supplierName',
    'contactName',
    'email',
    'phone'
  ];

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierManagementService,
    private snackBar: MatSnackBar
  ) {
    this.suppliers$ = this.supplierService.suppliers$.pipe(
      map(suppliers => suppliers || [])
    );
    this.supplierForm = this.createSupplierForm();
  }

  ngOnInit() { }

  createSupplierForm(): FormGroup {
    return this.fb.group({
      crNumber: ['', [Validators.required]],
      supplierName: ['', [Validators.required]],
      pointOfContact: this.fb.group({
        name: [''],
        email: ['', [Validators.email]],
        phone: ['']
      }),
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: ['']
      })
    });
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      const supplierData: Supplier = this.supplierForm.value;

      if (this.editingSupplier) {
        // Update existing supplier logic (to be implemented)
        this.supplierService.updateSupplier(supplierData);
        this.snackBar.open('Supplier Updated', 'Close', { duration: 3000 });
      } else {
        // Add new supplier
        supplierData.crNumber = supplierData.crNumber || this.generateCRNumber();
        this.supplierService.addSupplier(supplierData);
        this.snackBar.open('Supplier Added', 'Close', { duration: 3000 });
      }

      this.supplierForm.reset();
      this.editingSupplier = null;
    }
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

          this.parsedSuppliers = (results.data as any[][])
            .slice(1) // Skip header row
            .filter((row: any[]) => row[0] && row[1]) // Require at least CR Number and Supplier Name
            .map((row: any[]) => ({
              crNumber: row[0] || this.generateCRNumber(),
              supplierName: row[1] || '',
              pointOfContact: {
                name: row[2] || '',
                email: row[3] || '',
                phone: row[4] || ''
              },
              address: {
                street: row[5] || '',
                city: row[6] || '',
                state: row[7] || '',
                postalCode: row[8] || '',
                country: row[9] || ''
              }
            }));

          this.snackBar.open(`${this.parsedSuppliers.length} Suppliers Parsed`, 'Close', { duration: 3000 });
        },
        header: false
      });
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.parsedSuppliers.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.parsedSuppliers.forEach(row => this.selection.select(row));
  }

  addSelectedSuppliers() {
    const selectedSuppliers = this.selection.selected;

    if (selectedSuppliers.length > 0) {
      selectedSuppliers.forEach(supplier => {
        this.supplierService.addSupplier(supplier);
      });

      this.snackBar.open(`${selectedSuppliers.length} Suppliers Added`, 'Close', { duration: 3000 });

      // Remove added suppliers from parsed suppliers
      this.parsedSuppliers = this.parsedSuppliers.filter(
        supplier => !selectedSuppliers.includes(supplier)
      );

      // Clear selection
      this.selection.clear();
    }
  }

  addAllParsedSuppliers() {
    if (this.parsedSuppliers.length > 0) {
      this.parsedSuppliers.forEach(supplier => {
        this.supplierService.addSupplier(supplier);
      });

      this.snackBar.open(`${this.parsedSuppliers.length} Suppliers Added`, 'Close', { duration: 3000 });
      this.parsedSuppliers = [];
    }
  }

  editSupplier(supplier: Supplier) {
    this.editingSupplier = supplier;
    this.supplierForm.patchValue(supplier);
  }

  deleteSupplier(crNumber: string) {
    this.supplierService.removeSupplier(crNumber);
    this.snackBar.open('Supplier Deleted', 'Close', { duration: 3000 });
  }

  private generateCRNumber(): string {
    // Generate a unique CR number 
    const timestamp = new Date().getTime();
    return `CR-${timestamp}`;
  }
}