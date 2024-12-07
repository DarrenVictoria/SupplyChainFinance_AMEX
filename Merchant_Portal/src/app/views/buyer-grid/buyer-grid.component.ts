import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

interface Buyer {
  name: string;
  logo: string;
  redirectLink: string;
  isRegistered: boolean;
}

@Component({
  selector: 'app-buyer-grid',
  templateUrl: './buyer-grid.component.html',
  styleUrls: ['./buyer-grid.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class BuyerGridComponent implements OnInit {
  buyers: Buyer[] = [
    {
      name: 'Howings Engineering',
      logo: '/howings-logo.png',
      redirectLink: '/howings',
      isRegistered: true
    },
    {
      name: 'Exceer',
      logo: '/exceer-logo.png',
      redirectLink: '/exceer',
      isRegistered: true
    },
    {
      name: 'MFC',
      logo: '/mfc-logo.png',
      redirectLink: '/mfc',
      isRegistered: true
    },
    {
      name: 'JKI Corporation',
      logo: '/jki-logo.png',
      redirectLink: '/jki',
      isRegistered: true
    }
  ];

  constructor(
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void { }

  navigateToBuyer(redirectLink: string): void {
    this.router.navigate([redirectLink]);
  }

  openAddBuyerDialog(): void {
    const dialogRef = this.dialog.open(AddBuyerDialogComponent, {
      width: '350px',
      data: { buyerCode: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Add logic to process the new buyer code
        console.log('Buyer code added:', result);
      }
    });
  }
}

@Component({
  selector: 'app-add-buyer-dialog',
  template: `
    <div class="add-buyer-dialog-container">
      <h2 mat-dialog-title>Add Buyer</h2>
      
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="buyer-code-input">
          <mat-label>Buyer Code</mat-label>
          <input 
            matInput 
            [(ngModel)]="buyerCode" 
            placeholder="Enter buyer code"
            maxlength="20"
          >
        </mat-form-field>
      </mat-dialog-content>
      
      <mat-dialog-actions>
        <button 
          mat-stroked-button 
          color="basic" 
          (click)="onCancel()"
          class="dialog-button cancel-button"
        >
          Cancel
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="onAdd()" 
          [disabled]="!buyerCode"
          class="dialog-button add-button"
        >
          Add Buyer
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .add-buyer-dialog-container {
      min-width: 150px;
      padding: 8px;
    }

    .buyer-code-input {
      width: 100%;
      padding-top: 20px;
    }

    .mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      padding: 0;
    }

    .dialog-button {
      min-width: 100px;
      text-transform: uppercase;
      margin-left: 8px;
    }

    .cancel-button {
      color: #6c757d;
    }

    .add-button {
      background-color: #007bff;
      color: white;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule
  ]
})
export class AddBuyerDialogComponent {
  buyerCode: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddBuyerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { buyerCode: string }
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    const trimmedCode = this.buyerCode;
    if (trimmedCode) {
      this.dialogRef.close(trimmedCode);
    }
  }
}