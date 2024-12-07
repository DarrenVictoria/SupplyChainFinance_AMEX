import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';

interface Merchant {
  id: number;
  name: string;
  dateCreated: Date;
  createdBy: string;
  registeredBuyer: string;
  status: 'Active' | 'Inactive';
  approvalStatus: 'Pass' | 'Fail';
  manager: string;
  email: string;
  phone: string;
  blacklisted: boolean;
}

@Component({
  selector: 'app-merchants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSortModule,
    RouterModule
  ],
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.css']
})
export class MerchantsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterForm: FormGroup;
  dataSource: MatTableDataSource<Merchant>;
  isFiltersApplied = false;

  showMerchantsContent = true;
  showApproveMerchantsContent = false;

  merchants: Merchant[] = [
    {
      id: 1,
      name: 'Sunrise Innovations LLC',
      dateCreated: new Date('2024-01-15'),
      createdBy: 'Mark Smith',
      registeredBuyer: 'Tyler Phillips',
      status: 'Active',
      approvalStatus: 'Pass',
      manager: 'Sarah',
      email: 'sarah@abc.com',
      phone: '(555) 123-4567',
      blacklisted: false
    },
    {
      id: 2,
      name: 'Vanguard Resource Group LP',
      dateCreated: new Date('2024-02-18'),
      createdBy: 'John Bill',
      registeredBuyer: 'John Bill',
      status: 'Inactive',
      approvalStatus: 'Fail',
      manager: 'Mark',
      email: 'sarah@abc.com',
      phone: '(555) 123-4567',
      blacklisted: true
    },
    {
      id: 3,
      name: 'Quantum Edge Systems Inc',
      dateCreated: new Date('2024-03-12'),
      createdBy: 'Walter Stan',
      registeredBuyer: 'Walter Stan',
      status: 'Active',
      approvalStatus: 'Pass',
      manager: 'John',
      email: 'sarah@abc.com',
      phone: '(555) 123-4567',
      blacklisted: false
    },
    {
      id: 4,
      name: 'Maple Leaf Consulting',
      dateCreated: new Date('2024-04-05'),
      createdBy: 'Will Black',
      registeredBuyer: 'Tyler Phillips',
      status: 'Inactive',
      approvalStatus: 'Fail',
      manager: 'Luke',
      email: 'sarah@abc.com',
      phone: '(555) 123-4567',
      blacklisted: false
    },
    {
      id: 5,
      name: 'Blue Horizon Ventures LLC',
      dateCreated: new Date('2024-04-20'),
      createdBy: 'Smith Stacker',
      registeredBuyer: 'Harry J',
      status: 'Active',
      approvalStatus: 'Pass',
      manager: 'Sam',
      email: 'sarah@abc.com',
      phone: '(555) 123-4567',
      blacklisted: false
    }
  ];

  displayedColumns: string[] = [
    'id', 'name', 'dateCreated', 'manager', 'email', 'phone', 'status', 'blacklisted', 'actions'
  ];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      status: [''],
      approvalStatus: [''],
      blacklisted: [''],
      searchType: ['name'],
      searchTerm: ['']
    });

    this.dataSource = new MatTableDataSource(this.merchants);
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

  openDeactivationDialog(merchant: Merchant): void {
    const dialogRef = this.dialog.open(DeactivationDialogComponent, {
      width: '400px',
      data: merchant
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deactivateMerchant(merchant, result);
      }
    });
  }

  deactivateMerchant(merchant: Merchant, reason: string): void {
    const index = this.merchants.findIndex(m => m.id === merchant.id);
    if (index !== -1) {
      this.merchants[index].status = 'Inactive';
      this.dataSource.data = [...this.merchants];
      console.log('Deactivated:', merchant, 'Reason:', reason);
    }
  }


  checkFiltersApplied() {
    const formValues = this.filterForm.value;
    this.isFiltersApplied = !!(
      formValues.fromDate ||
      formValues.toDate ||
      formValues.status ||
      formValues.approvalStatus ||
      formValues.blacklisted ||
      formValues.searchTerm
    );
  }

  resetFilters(): void {
    this.filterForm.reset({
      fromDate: '',
      toDate: '',
      status: '',
      approvalStatus: '',
      blacklisted: '',
      searchType: 'name',
      searchTerm: ''
    });

    this.dataSource.data = this.merchants;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.isFiltersApplied = false;
  }

  applyFilters() {
    let filtered = [...this.merchants];
    const filters = this.filterForm.value;

    if (filters.fromDate) {
      filtered = filtered.filter(merchant =>
        merchant.dateCreated >= new Date(filters.fromDate)
      );
    }

    if (filters.toDate) {
      filtered = filtered.filter(merchant =>
        merchant.dateCreated <= new Date(filters.toDate)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(merchant =>
        merchant.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.approvalStatus) {
      filtered = filtered.filter(merchant =>
        merchant.approvalStatus.toLowerCase() === filters.approvalStatus.toLowerCase()
      );
    }

    // Add blacklist filter
    if (filters.blacklisted !== '') {
      filtered = filtered.filter(merchant =>
        merchant.blacklisted === (filters.blacklisted === 'true')
      );
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(merchant =>
        merchant.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    this.dataSource.data = filtered;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-500';
      case 'inactive':
        return 'text-red-500';
      default:
        return '';
    }
  }

  getApprovalStatusClass(approvalStatus: string): string {
    switch (approvalStatus.toLowerCase()) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'pending approval':
        return 'text-orange-500';
      default:
        return '';
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
    this.dialog.open(SupplierDetailsDialogComponent, {
      width: '600px',
      data: merchant
    });
  }
}

@Component({
  selector: 'app-supplier-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ],
  template: `
    <div class="p-6">
      <h2 mat-dialog-title class="text-2xl font-bold mb-4">Supplier Details</h2>
      <mat-dialog-content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Information Section -->
          <div class="bg-gray-50 border rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4 border-b pb-2" style="margin-top:1rem; font-weight:bold;">Basic Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between border-b pb-1">
                <span class="font-medium">Supplier Name:</span>
                <span>{{ data.name }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-medium">CR Number:</span>
                <span>{{ supplierDetails.crNumber }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-medium">Business Type:</span>
                <span>{{ supplierDetails.businessType }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Date Created:</span>
                <span>{{ data.dateCreated | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>

          <!-- Verification Status Section -->
          <div class="bg-gray-50 border rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4 border-b pb-2" style="margin-top:1rem; font-weight:bold;">Verification Status</h3>
            <div class="space-y-2">
              
              <div class="flex justify-between border-b pb-1">
                <span class="font-medium">Supplier Status:</span>
                <span 
                  class="font-semibold"
                  style="color: {{ data.status === 'Active' ? '#10B981' : '#EF4444' }}"
                >
                  {{ data.status }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Last Updated:</span>
                <span>{{ supplierDetails.lastUpdated | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div class="bg-gray-50 border rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4 border-b pb-2" style="margin-top:1rem; font-weight:bold;">Contact Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between border-b pb-1">
                <span class="font-medium">Email:</span>
                <span>{{ supplierDetails.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Phone:</span>
                <span>{{ supplierDetails.phone }}</span>
              </div>
            </div>
          </div>

          <!-- Address Section -->
          <div class="bg-gray-50 border rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-4 border-b pb-2" style="margin-top:1rem; font-weight:bold;">Address</h3>
            <div class="space-y-2">
              <div class="flex justify-between border-b pb-1">
                <span class="font-medium">Street:</span>
                <span>{{ supplierDetails.street }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-medium">City:</span>
                <span>{{ supplierDetails.city }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-medium">State:</span>
                <span>{{ supplierDetails.state }}</span>
              </div>
              <div class="flex justify-between border-b pb-1">
                <span class="font-medium">Postal Code:</span>
                <span>{{ supplierDetails.postalCode }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Country:</span>
                <span>{{ supplierDetails.country }}</span>
              </div>
            </div>
          </div>

          <!-- Additional Information Section -->
          <div class="bg-gray-50 border rounded-lg p-4 md:col-span-2">
            <h3 class="text-lg font-semibold mb-4 border-b pb-2" style="margin-top:1rem; font-weight:bold;">Additional Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between border-b pb-1">
                <span class="font-medium">Products/Services Offered:</span>
                <span>{{ supplierDetails.productsServices }}</span>
              </div>
              <div>
                <span class="font-medium block mb-2">Notes:</span>
                <p class="text-gray-600 bg-white p-3 rounded-lg">{{ supplierDetails.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions class="flex justify-between items-center mt-4">
        <button mat-button (click)="dialogRef.close()">Close</button>
        
      </mat-dialog-actions>
    </div>
  `
})
export class SupplierDetailsDialogComponent {
  supplierDetails = {
    crNumber: 'CR-SIL00100',
    email: 'contact@sunriseinnovations.com',
    phone: '(123) 456-7890',
    street: '123 Innovation Way',
    city: 'Tech City',
    state: 'CA',
    postalCode: '90210',
    country: 'USA',
    businessType: 'LLC',
    productsServices: 'Technology Solutions, Cloud Computing, IT Consulting',
    lastUpdated: new Date('2024-11-30'),
    notes: 'Preferred supplier for tech equipment and innovative solutions. Long-standing relationship with proven track record of delivering high-quality services.'
  };

  constructor(
    public dialogRef: MatDialogRef<SupplierDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Merchant,
    public dialog: MatDialog
  ) { }

  toggleSupplierStatus() {
    if (this.data.status === 'Active') {
      // Open deactivation dialog for active suppliers
      const dialogRef = this.dialog.open(DeactivationDialogComponent, {
        width: '400px',
        data: this.data
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Update the merchant status to Inactive
          this.data.status = 'Inactive';
          this.dialogRef.close(this.data);
        }
      });
    } else {
      // Directly activate the supplier
      this.data.status = 'Active';
      this.dialogRef.close(this.data);
    }
  }
}

// The DeactivationDialogComponent remains the same as in the previous implementation
@Component({
  selector: 'app-deactivation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSlideToggleModule // Add this import for the toggle
  ],
  template: `
    <h2 mat-dialog-title>Deactivate Supplier</h2>
    <mat-dialog-content>
      <p>Please provide a reason for deactivating this supplier:</p>
      <mat-form-field class="w-full">
        <textarea matInput [(ngModel)]="deactivationReason" placeholder="Reason for deactivation" rows="4"></textarea>
      </mat-form-field>
      
      <!-- Add blacklist toggle -->
      <mat-slide-toggle [(ngModel)]="shouldBlacklist" class="mt-4">
        <b>Blacklist Supplier</b>
      </mat-slide-toggle>
      <p *ngIf="shouldBlacklist" class="text-sm text-gray-600 mt-2">
        Blacklisting will prevent this supplier from future engagements.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button 
        mat-button 
        color="warn" 
        (click)="onConfirm()" 
        [disabled]="!deactivationReason"
      >
        Confirm
      </button>
    </mat-dialog-actions>
  `
})
export class DeactivationDialogComponent {
  deactivationReason: string = '';
  shouldBlacklist: boolean = false; // New property to track blacklist status

  constructor(
    public dialogRef: MatDialogRef<DeactivationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Merchant
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.deactivationReason.trim()) {
      // Pass both the deactivation reason and blacklist status
      this.dialogRef.close({
        reason: this.deactivationReason,
        blacklist: this.shouldBlacklist
      });
    }
  }
}