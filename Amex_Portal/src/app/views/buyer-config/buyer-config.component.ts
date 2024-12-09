import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Material UI Imports (existing imports plus new ones)
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


// Existing code for UserRole, User, USER_DATASET, etc.
export enum UserRole {
  SystemAdmin = 'System Admin',
  Manager = 'Manager'
}

interface User {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

// New interface for Program
interface Program {
  programName: string;
  productTypes: string[];
  dailyRateFactoring: number | null;
  dailyRateDirect: number | null;
  invoiceRedirectionPeriod: number | null; // New property for Direct Payment
  gracePeriod: number | null;
  monthlySupplierSubscriptionFee: number | null;
  monthlyBuyerSubscriptionFee: number | null;
  invoiceAmountMin: number | null;
  invoiceAmountMax: number | null;
  financingDaysMin: number | null;
  financingDaysMax: number | null;
  profitSharingAMEX: number | null;
  profitSharingBuyer: number | null;
  supplierExceptions: { name: string; dailyRate: number; }[];
  isActive: boolean; // New property to track active status
}

const SAMPLE_PROGRAMS: Program[] = [
  {
    programName: 'Program A',
    productTypes: ['Approved Invoice Factoring', 'Direct Payment'],
    dailyRateFactoring: 1.5,
    dailyRateDirect: 1.2,
    gracePeriod: 30,
    monthlySupplierSubscriptionFee: 500,
    monthlyBuyerSubscriptionFee: 750,
    invoiceAmountMin: 10000,
    invoiceRedirectionPeriod: 24, // New property for Direct Payment
    invoiceAmountMax: 500000,
    financingDaysMin: 30,
    financingDaysMax: 120,
    profitSharingAMEX: 5,
    profitSharingBuyer: 3,
    supplierExceptions: [
      { name: 'Supplier 1', dailyRate: 1.8 },
      { name: 'Supplier 2', dailyRate: 2.0 }
    ],
    isActive: true
  },
  {
    programName: 'Program B',
    productTypes: ['Direct Payment'],
    dailyRateFactoring: null,
    dailyRateDirect: 1.0,
    gracePeriod: 15,
    monthlySupplierSubscriptionFee: 250,
    monthlyBuyerSubscriptionFee: 500,
    invoiceRedirectionPeriod: 24,
    invoiceAmountMin: 5000,
    invoiceAmountMax: 250000,
    financingDaysMin: 20,
    financingDaysMax: 90,
    profitSharingAMEX: 3,
    profitSharingBuyer: 2,
    supplierExceptions: [],
    isActive: false
  }
];

// Mock dataset for usernames (simulating DB load)
const USER_DATASET = [
  {
    userName: 'Fredy',
    firstName: 'Fredy',
    lastName: 'Sammy',
    email: 'fredy@affno.lk',
    role: UserRole.SystemAdmin
  },
  {
    userName: 'markdixon',
    firstName: 'Mark',
    lastName: 'Dixon',
    email: 'markdixon@water.lk',
    role: UserRole.Manager
  },
];

@Component({
  selector: 'app-user-management',
  templateUrl: './buyer-config.component.html',
  styleUrls: ['./buyer-config.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSlideToggleModule,
  ]
})
export class BuyerConfigComponent {

  displayedColumns: string[] = ['userName', 'firstName', 'lastName', 'email', 'role', 'actions'];
  programDisplayColumns: string[] = ['name', 'value'];

  users: User[] = [...USER_DATASET];
  userDataset = USER_DATASET;
  userRoles = Object.values(UserRole);

  programs: Program[] = SAMPLE_PROGRAMS;
  selectedProgram: Program | null = null;
  programForm: FormGroup;

  mainActiveToggle = true;
  enableNotifications = true;
  enableMakerCheckerInvoice = false;
  enablePriorDueDateReminders = false;
  enableAutoFinance = false;
  priorDueDateReminderDay: number = 0;
  priorDueDateReminderHour: number = 0;
  priorDueDateReminderMinute: number = 0;
  enableRepeatReminder: boolean = false;
  repeatReminderInterval: number = 0;
  repeatReminderUnit: 'days' | 'hours' | 'minutes' = 'hours';
  autoFinanceComparisonOperator: string = '<=';
  autoFinanceInvoiceValue: number | null = null;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.programForm = this.createProgramForm(SAMPLE_PROGRAMS[0]);
    this.selectProgram(SAMPLE_PROGRAMS[0]);
  }

  // Method to open New User Dialog
  openNewUserDialog() {
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      width: '100%',
      maxWidth: '500px',
      data: {
        userDataset: this.userDataset,
        userRoles: this.userRoles,
        existingUsers: this.users
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.users = [...this.users, result];
        this.snackBar.open('User added successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    });
  }



  openUserDetailsDialog(user: User) {
    const dialogRef = this.dialog.open(UserDetailsDialogComponent, {
      width: '100%',
      maxWidth: '500px',
      data: {
        user: { ...user },
        userRoles: this.userRoles
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.users.findIndex(u => u.userName === user.userName);
        if (index !== -1) {
          this.users[index] = { ...result };
          this.users = [...this.users];
          this.snackBar.open('User details updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      }
    });
  }

  deleteUser(user: User) {
    const index = this.users.findIndex(u => u.userName === user.userName);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.users = [...this.users];
      this.snackBar.open('User deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  generatePassword(user: User) {
    console.log(`Generating password for user: ${user.userName}`);
    this.snackBar.open(`Credentials for ${user.userName} copied to clipboard`, 'Close', {
      duration: 3000
    });
  }

  createProgramForm(program: Program): FormGroup {
    return this.fb.group({
      programName: [{ value: program.programName, disabled: true }, Validators.required],
      productTypes: [{ value: program.productTypes, disabled: true }, Validators.required],
      dailyRateFactoring: [{ value: program.dailyRateFactoring, disabled: true }],
      dailyRateDirect: [{ value: program.dailyRateDirect, disabled: true }],
      gracePeriod: [{ value: program.gracePeriod, disabled: true }],
      monthlySupplierSubscriptionFee: [{ value: program.monthlySupplierSubscriptionFee, disabled: true }],
      monthlyBuyerSubscriptionFee: [{ value: program.monthlyBuyerSubscriptionFee, disabled: true }],
      invoiceAmountMin: [{ value: program.invoiceAmountMin, disabled: true }],
      invoiceAmountMax: [{ value: program.invoiceAmountMax, disabled: true }],
      financingDaysMin: [{ value: program.financingDaysMin, disabled: true }],
      financingDaysMax: [{ value: program.financingDaysMax, disabled: true }],
      profitSharingAMEX: [{ value: program.profitSharingAMEX, disabled: true }],
      profitSharingBuyer: [{ value: program.profitSharingBuyer, disabled: true }],
    });
  }

  selectProgram(program: Program) {
    // Deactivate previously active program
    const previousActiveProgram = this.programs.find(p => p.isActive);
    if (previousActiveProgram) {
      previousActiveProgram.isActive = false;
    }

    // Activate selected program
    program.isActive = true;
    this.selectedProgram = program;
    this.programForm = this.createProgramForm(program);
  }

  getSupplierExceptions(): string[] {
    if (!this.selectedProgram || !this.selectedProgram.supplierExceptions) {
      return ['N/A'];
    }
    return this.selectedProgram.supplierExceptions.map(s => `${s.name}: ${s.dailyRate}%`);
  }

  onMainActiveToggleChange(checked: boolean) {
    this.mainActiveToggle = checked;
  }

  onNotificationsToggleChange(checked: boolean) {
    this.enableNotifications = checked;
  }

  onMakerCheckerInvoiceToggleChange(checked: boolean) {
    this.enableMakerCheckerInvoice = checked;
  }






  onAutoFinance(checked: boolean) {
    this.enableAutoFinance = checked;

    // Optional: Reset values if disabled
    if (!checked) {
      this.autoFinanceComparisonOperator = '<=';
      this.autoFinanceInvoiceValue = null;
    }
  }


  onPriorDueDateReminders(checked: boolean) {
    this.enablePriorDueDateReminders = checked;

    // Reset values if disabled
    if (!checked) {
      this.priorDueDateReminderDay = 0;
      this.priorDueDateReminderHour = 0;
      this.priorDueDateReminderMinute = 0;
      this.enableRepeatReminder = false;
      this.repeatReminderInterval = 0;
      this.repeatReminderUnit = 'hours';
    }
  }

  // Add a method to handle repeat reminder toggle
  onRepeatReminderToggle(checked: boolean) {
    this.enableRepeatReminder = checked;

    // Reset interval if disabled
    if (!checked) {
      this.repeatReminderInterval = 0;
      this.repeatReminderUnit = 'hours';
    }
  }

  getProgramDetails(): { name: string; value: string; group?: string }[] {
    if (!this.selectedProgram) {
      return [];
    }
    const program = this.selectedProgram;
    return [
      { name: 'Program Name', value: program.programName },
      { name: 'Product Types', value: program.productTypes.join(', ') },
      { name: 'Auto Financing', value: 'Yes' },
      {
        name: 'Daily Rate (Approved Invoice Factoring)',
        value: program.dailyRateFactoring ? `${program.dailyRateFactoring}%` : 'N/A',
        group: 'daily-rate-factoring-group'
      },
      { name: 'Supplier Exceptions', value: 'See below', group: 'daily-rate-factoring-group' },

      // Direct Payment group - now including Invoice Redirection Period
      {
        name: 'Daily Rate (Direct)',
        value: program.dailyRateDirect ? `${program.dailyRateDirect}%` : 'N/A',
        group: 'daily-rate-direct-group'
      },
      {
        name: 'Grace Period',
        value: program.gracePeriod ? `${program.gracePeriod} days` : 'N/A',
        group: 'daily-rate-direct-group'
      },
      {
        name: 'Invoice Redirection Period',
        value: program.invoiceRedirectionPeriod ? `${program.invoiceRedirectionPeriod} hours` : 'N/A',
        group: 'daily-rate-direct-group'  // Added to the same group as other Direct settings
      },

      // Rest of the details remain the same
      { name: 'Monthly Supplier Subscription Fee', value: program.monthlySupplierSubscriptionFee ? `$${program.monthlySupplierSubscriptionFee}` : 'N/A' },
      { name: 'Monthly Buyer Subscription Fee', value: program.monthlyBuyerSubscriptionFee ? `$${program.monthlyBuyerSubscriptionFee}` : 'N/A' },
      { name: 'Invoice Amount (Min)', value: program.invoiceAmountMin ? `$${program.invoiceAmountMin}` : 'N/A' },
      { name: 'Invoice Amount (Max)', value: program.invoiceAmountMax ? `$${program.invoiceAmountMax}` : 'N/A' },
      { name: 'Financing Days (Min)', value: program.financingDaysMin ? `${program.financingDaysMin} days` : 'N/A' },
      { name: 'Financing Days (Max)', value: program.financingDaysMax ? `${program.financingDaysMax} days` : 'N/A' },
      { name: 'Profit Sharing (AMEX)', value: program.profitSharingAMEX ? `${program.profitSharingAMEX}%` : 'N/A' },
      { name: 'Profit Sharing (Buyer)', value: program.profitSharingBuyer ? `${program.profitSharingBuyer}%` : 'N/A' },
    ];
  }
}


@Component({
  selector: 'app-new-user-dialog',
  template: `
    <h2 mat-dialog-title>Add New User</h2>
    <mat-dialog-content>
      <form (ngSubmit)="onSave()" #newUserForm="ngForm">
        <mat-form-field>
          <mat-label>Username</mat-label>
          <mat-select 
            [(ngModel)]="newUser.userName" 
            name="userName" 
            (selectionChange)="onUsernameSelect()" 
            required>
            <mat-option 
              *ngFor="let user of data.userDataset" 
              [value]="user.userName"
              [disabled]="isUsernameTaken(user.userName)">
              {{user.userName}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="newUser.userName && isUsernameTaken(newUser.userName)">
            Username already taken
          </mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>First Name</mat-label>
          <input matInput [(ngModel)]="newUser.firstName" name="firstName" readonly>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Last Name</mat-label>
          <input matInput [(ngModel)]="newUser.lastName" name="lastName" readonly>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="newUser.email" name="email" readonly>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Role</mat-label>
          <mat-select 
            [(ngModel)]="newUser.role" 
            name="role" 
            required>
            <mat-option *ngFor="let role of data.userRoles" [value]="role">
              {{role}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div mat-dialog-actions>
          <button mat-button (click)="onCancel()">Cancel</button>
          <button mat-button color="primary" type="submit" 
            [disabled]="!newUserForm.form.valid || isUsernameTaken(newUser.userName)">
            Save
          </button>
        </div>
      </form>
    </mat-dialog-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class NewUserDialogComponent {
  newUser: User = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    role: UserRole.Manager
  };

  constructor(
    public dialogRef: MatDialogRef<NewUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      userDataset: User[],
      userRoles: UserRole[],
      existingUsers: User[]
    }
  ) { }

  onUsernameSelect() {
    const selectedUser = this.data.userDataset.find(
      user => user.userName === this.newUser.userName
    );

    if (selectedUser) {
      this.newUser.firstName = selectedUser.firstName;
      this.newUser.lastName = selectedUser.lastName;
      this.newUser.email = selectedUser.email;
    }
  }

  isUsernameTaken(username: string): boolean {
    return this.data.existingUsers.some(user => user.userName === username);
  }

  onSave() {
    if (this.isValidUser(this.newUser) && !this.isUsernameTaken(this.newUser.userName)) {
      this.dialogRef.close(this.newUser);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private isValidUser(user: User): boolean {
    return !!(
      user.userName.trim() &&
      user.firstName.trim() &&
      user.lastName.trim() &&
      user.email.trim() &&
      user.role
    );
  }
}

@Component({
  selector: 'app-user-details-dialog',
  template: `
    <h2 mat-dialog-title>Edit User Details</h2>
    <mat-dialog-content>
      <form (ngSubmit)="onSave()" #userDetailsForm="ngForm">
        <mat-form-field>
          <mat-label>Username</mat-label>
          <input matInput [value]="data.user.userName" readonly>
        </mat-form-field>

        <mat-form-field>
          <mat-label>First Name</mat-label>
          <input matInput [value]="data.user.firstName" readonly>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Last Name</mat-label>
          <input matInput [value]="data.user.lastName" readonly>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput [value]="data.user.email" readonly>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Role</mat-label>
          <mat-select 
            [(ngModel)]="editedUser.role" 
            name="role" 
            required>
            <mat-option *ngFor="let role of data.userRoles" [value]="role">
              {{role}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div mat-dialog-actions>
          <button mat-button (click)="onCancel()">Cancel</button>
          <button mat-button color="primary" type="submit" 
            [disabled]="!userDetailsForm.form.valid">
            Save Changes
          </button>
        </div>
      </form>
    </mat-dialog-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class UserDetailsDialogComponent {
  editedUser: User;

  constructor(
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      user: User,
      userRoles: UserRole[]
    }
  ) {
    // Create a copy of the user data to prevent direct mutation
    this.editedUser = { ...data.user };
  }

  onSave() {
    this.dialogRef.close({
      ...this.data.user,
      role: this.editedUser.role
    });
  }

  onCancel() {
    this.dialogRef.close();
  }




}



