import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface InvoiceData {
    requestId: string;
    dateCreated: string;
    merchant: string;
    invoiceNumber: string;
    invoiceAmount: number;
    creditAmount: number;
    productCode: string;
    buyerStatus: string;
    paymentStatus: string;
    paymentTerms: '30 days' | '60 days' | '90 days';
}

@Injectable({
    providedIn: 'root'
})
export class InvoiceDataService {
    private invoiceDataSource = new BehaviorSubject<InvoiceData[]>([]);
    currentInvoiceData = this.invoiceDataSource.asObservable();

    constructor() { }

    updateInvoiceData(invoices: any[]) {
        const processedInvoices: InvoiceData[] = invoices.flatMap(merchant =>
            merchant.invoices.map((invoice: any, index: number) => ({
                requestId: `REQ-${merchant.merchantName.toUpperCase()}-${Date.now()}-${index + 1}`,
                dateCreated: new Date().toLocaleDateString(),
                merchant: this.getMerchantFullName(merchant.merchantName),
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

    private getMerchantFullName(shortName: string): string {
        const merchantMap: { [key: string]: string } = {
            'sbc': 'SBC Holdings Pvt Ltd',
            'jana': 'Janashakthi Pvt Ltd',
            'emaar': 'Emaar Pvt Ltd'
        };
        return merchantMap[shortName] || shortName;
    }

    private calculateCreditAmount(totalAmount: number): number {
        // Calculate credit amount (e.g., 97% of total amount)
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