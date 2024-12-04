import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

interface ProductType {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-type-products',
  templateUrl: './type-products.component.html',
  styleUrls: ['./type-products.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class TypeProductsComponent {
  productTypes: ProductType[] = [
    {
      id: 1,
      name: 'Approved Invoice Factoring',
      description: 'The buyer or supplier have the ability to upload approved invoices to the system in order to request for factoring.'
    },
    {
      id: 2,
      name: 'Direct Payment',
      description: 'The Buyer can pay the supplier directly through the AMEX Card but will be among a specified criteria'
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
          name: result.name,
          description: result.description
        };
        this.productTypes = [...this.productTypes, newProduct];
      }
    });
  }
}

@Component({
  selector: 'app-add-product-dialog',
  template: `
    <h2 mat-dialog-title>Add New Product Type</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Product Name</mat-label>
        <input matInput [(ngModel)]="productName" required>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Description</mat-label>
        <textarea matInput [(ngModel)]="productDescription" required></textarea>
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
  productName: string = '';
  productDescription: string = '';

  constructor(public dialogRef: MatDialogRef<AddProductDialogComponent>) { }

  isFormValid(): boolean {
    return this.productName.trim() !== '' && this.productDescription.trim() !== '';
  }

  onAdd(): void {
    this.dialogRef.close({
      name: this.productName,
      description: this.productDescription
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

