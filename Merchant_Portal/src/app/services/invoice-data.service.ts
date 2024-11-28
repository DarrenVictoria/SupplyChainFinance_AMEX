import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface InvoiceData {
    requestId: string;
    dateCreated: string;
    buyerName: string;
    invoiceNumber: string;
    invoiceAmount: number;
    creditAmount: number;
    productCode: string;
    buyerStatus: string;
    paymentStatus: string;
    merchantStatus?: string; // Add this optional property
    approvedBy?: string;
    approvedDate?: string;
    approvalStatus?: 'Approved' | 'Rejected' | 'Pending';
}

@Injectable({
    providedIn: 'root'
})
export class InvoiceDataService {
    private invoiceDataSource = new BehaviorSubject<InvoiceData[]>([]);
    currentInvoiceData = this.invoiceDataSource.asObservable();

    constructor() { }

    updateInvoiceData(buyers: any[]) {
        const processedInvoices: InvoiceData[] = buyers.flatMap(buyer =>
            buyer.invoices.map((invoice: any, index: number) => ({
                requestId: `REQ-${buyer.buyerName.toUpperCase().replace(/\s+/g, '')}-${Date.now()}-${index + 1}`,
                dateCreated: new Date().toLocaleDateString(),
                buyerName: buyer.buyerName,
                invoiceNumber: invoice.invoiceNumber,
                invoiceAmount: invoice.totalAmount,
                creditAmount: this.calculateCreditAmount(invoice.totalAmount),
                productCode: this.generateProductCode(),
                buyerStatus: this.generateBuyerStatus(),
                paymentStatus: this.generatePaymentStatus()
            }))
        );

        this.invoiceDataSource.next([
            ...this.invoiceDataSource.value,
            ...processedInvoices
        ]);
    }

    private calculateCreditAmount(totalAmount: number): number {
        return Math.round(totalAmount * 0.97 * 100) / 100;
    }

    private generateProductCode(): string {
        const codes = ['ID', 'RF'];
        return codes[Math.floor(Math.random() * codes.length)];
    }

    private generateBuyerStatus(): string {
        const statuses = ['Approved', 'Pending Approval', 'Rejected'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    private generatePaymentStatus(): string {
        const statuses = ['Paid', 'Unpaid'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }
}