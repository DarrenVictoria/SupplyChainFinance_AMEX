import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SupplierPointOfContact {
    name: string;
    email: string;
    phone: string;
}

export interface SupplierAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface Supplier {
    crNumber: string;
    supplierName: string;
    pointOfContact: SupplierPointOfContact;
    address: SupplierAddress;
}

@Injectable({
    providedIn: 'root'
})
export class SupplierManagementService {
    private suppliersSubject = new BehaviorSubject<Supplier[]>([]);
    suppliers$ = this.suppliersSubject.asObservable();

    constructor() {
        const initialSuppliers: Supplier[] = [
            {
                crNumber: 'CR-INIT001',
                supplierName: 'Initial Supplier',
                pointOfContact: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '(123) 456-7890'
                },
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'ST',
                    postalCode: '12345',
                    country: 'United States'
                }
            }
        ];
        this.suppliersSubject.next(initialSuppliers);
    }

    addSupplier(supplier: Supplier) {
        const currentSuppliers = this.suppliersSubject.value;
        this.suppliersSubject.next([...currentSuppliers, supplier]);
    }

    removeSupplier(crNumber: string) {
        const currentSuppliers = this.suppliersSubject.value;
        const updatedSuppliers = currentSuppliers.filter(supplier =>
            supplier.crNumber !== crNumber
        );
        this.suppliersSubject.next(updatedSuppliers);
    }

    updateSupplier(updatedSupplier: Supplier) {
        const currentSuppliers = this.suppliersSubject.value;
        const updatedSuppliers = currentSuppliers.map(supplier =>
            supplier.crNumber === updatedSupplier.crNumber
                ? updatedSupplier
                : supplier
        );
        this.suppliersSubject.next(updatedSuppliers);
    }
}