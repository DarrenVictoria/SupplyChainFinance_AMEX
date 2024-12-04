import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

// Material UI Imports
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface User {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
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
    MatSnackBarModule
  ]
})
export class UserManagementComponent {
  displayedColumns: string[] = ['userName', 'firstName', 'lastName', 'email', 'actions'];

  users: User[] = [
    { userName: 'chamath', firstName: 'Chamath', lastName: 'Almedha', email: 'hashan@affno.lk' },
    { userName: 'customerportal', firstName: 'customerportal', lastName: 'customerportal', email: 'hashan@affno.lk' },
    { userName: 'dilshan', firstName: 'Dilshan', lastName: 'Kanishka', email: 'dinuka@affno.lk' },
    { userName: 'dimakka', firstName: 'Dimakka', lastName: 'wellalage', email: 'ireshaushan05@gmail.com' },
    { userName: 'dimuth', firstName: 'Dimuth', lastName: 'Karnangara', email: 'dinuka@affno.lk' }
  ];

  newUser: User = {
    userName: '',
    firstName: '',
    lastName: '',
    email: ''
  };

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  openUserDetailsDialog(user: User) {
    const dialogRef = this.dialog.open(UserDetailsDialogComponent, {
      width: '100%',
      maxWidth: '500px',
      data: { ...user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.users.findIndex(u => u.userName === user.userName);
        if (index !== -1) {
          // Update the entire user object in the table
          this.users[index] = { ...result };
          // Trigger change detection to update the table
          this.users = [...this.users];
        }
      }
    });
  }

  deleteUser(user: User) {
    // Find the index of the user to delete
    const index = this.users.findIndex(u => u.userName === user.userName);

    if (index !== -1) {
      // Remove the user from the array
      this.users.splice(index, 1);
      // Trigger change detection
      this.users = [...this.users];

      // Show a snackbar to confirm deletion
      this.snackBar.open('User deleted successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  addUser(userForm: NgForm) {
    if (userForm.valid) {
      // Create a new user object to avoid direct mutation
      const userToAdd: User = { ...this.newUser };

      // Add the new user to the users array
      this.users = [...this.users, userToAdd];

      // Show success snackbar
      this.snackBar.open('User added successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });

      // Reset the form
      userForm.resetForm();
    }
  }

  generatePassword(user: User) {
    console.log(`Generating password for user: ${user.userName}`);
  }
}

@Component({
  selector: 'app-user-details-dialog',
  template: `
    <h2 mat-dialog-title>User Details</h2>
    <mat-dialog-content class="dialog-content">
      <form (ngSubmit)="onSave()" class="full-width-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>User Name</mat-label>
            <input matInput [(ngModel)]="data.userName" name="userName" required>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>First Name</mat-label>
            <input matInput [(ngModel)]="data.firstName" name="firstName" required>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Last Name</mat-label>
            <input matInput [(ngModel)]="data.lastName" name="lastName" required>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" [(ngModel)]="data.email" name="email" required>
          </mat-form-field>
        </div>

        <mat-dialog-actions>
          <button mat-raised-button (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit">Save</button>
        </mat-dialog-actions>
      </form>
    </mat-dialog-content>
  `,
  styles: [`
    .dialog-content {
      width: 100%;
    }
    .full-width-form {
      width: 100%;
    }
    .form-row {
      width: 100%;
      margin-bottom: 15px;
    }
    .full-width {
      width: 100%;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class UserDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) { }

  onSave() {
    if (this.isValidUser(this.data)) {
      this.dialogRef.close(this.data);
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
      user.email.trim()
    );
  }
}