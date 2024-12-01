import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatCheckboxModule
  ]
})
export class TypeProductsComponent {
  /**
   * The list of product types to be displayed.
   */
  productTypes: ProductType[] = [
    {
      id: 1,
      name: 'Purchase Order (PO) Financing',
      description: 'PO financing allows suppliers to borrow money to fulfill a purchase order from a buyer. The financial institution advances a percentage of the purchase order amount to the supplier.'
    },
    {
      id: 2,
      name: 'Reverse Factoring',
      description: 'The buyer initiates the financing arrangement. Suppliers can sell their receivables (invoices) to a financial institution (factor) at a discount to receive early payment.'
    }
  ];

  /**
   * The list of currently active product types.
   */
  activeProducts: number[] = [];

  /**
   * Toggles the active state of the given product type.
   * @param productId The ID of the product type to toggle.
   */
  toggleProductActive(productId: number): void {
    if (this.activeProducts.includes(productId)) {
      this.activeProducts = this.activeProducts.filter(id => id !== productId);
    } else {
      this.activeProducts = [...this.activeProducts, productId];
    }
  }
}