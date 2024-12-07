import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

interface ProductType {
  id: number;
  programName: string;
  createdBy: string;
  dateCreated: Date;
  numberOfBuyersAssigned: number;
}

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterModule,
    MatIcon
  ]
})
export class ProgramsComponent {
  productTypes: ProductType[] = [
    {
      id: 1,
      programName: 'Program A',
      createdBy: 'John Doe',
      dateCreated: new Date('2024-01-15'),
      numberOfBuyersAssigned: 5
    },
    {
      id: 2,
      programName: 'Program B',
      createdBy: 'Jane Smith',
      dateCreated: new Date('2024-02-20'),
      numberOfBuyersAssigned: 3
    },
    {
      id: 3,
      programName: 'Program C',
      createdBy: 'Mallow Fond',
      dateCreated: new Date('2024-02-20'),
      numberOfBuyersAssigned: 7
    }
  ];

  activeProducts: number[] = [];

  constructor(public dialog: MatDialog) { }

  toggleProductActive(productId: number): void {
    if (this.activeProducts.includes(productId)) {
      this.activeProducts = this.activeProducts.filter(id => id !== productId);
    } else {
      this.activeProducts = [...this.activeProducts, productId];
    }
  }

  ngOnInit(): void {
    this.activeProducts = this.productTypes.map(product => product.id);
  }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newProduct: ProductType = {
          id: this.productTypes.length + 1,
          programName: result.programName,
          createdBy: result.createdBy,
          dateCreated: new Date(),
          numberOfBuyersAssigned: 0
        };
        this.productTypes = [...this.productTypes, newProduct];
      }
    });
  }
}

@Component({
  selector: 'app-add-product-dialog',
  template: `
    <h2 mat-dialog-title>Add New Program</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Program Name</mat-label>
        <input matInput [(ngModel)]="programName" required>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Created By</mat-label>
        <input matInput [(ngModel)]="createdBy" required>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button (click)="onAdd()" [disabled]="!isFormValid()">Add</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule
  ]
})
export class AddProductDialogComponent {
  programName: string = '';
  createdBy: string = '';

  constructor(public dialogRef: MatDialogRef<AddProductDialogComponent>) { }

  isFormValid(): boolean {
    return this.programName.trim() !== '' && this.createdBy.trim() !== '';
  }

  onAdd(): void {
    this.dialogRef.close({
      programName: this.programName,
      createdBy: this.createdBy
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}