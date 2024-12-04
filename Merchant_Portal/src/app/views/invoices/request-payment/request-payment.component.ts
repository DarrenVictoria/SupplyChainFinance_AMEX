import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './request-payment.component.html',
  styleUrls: ['./request-payment.component.css']
})
export class RequestPaymentComponent {
  invoiceAmount: number = 10000;
  paymentTerms: number = 90;
  earlyPaymentDay: number = 14;
  dailyRate: number = 5;

  get requestedEarlyPayment(): number {
    return this.paymentTerms - this.earlyPaymentDay;
  }

  get totalEarlyPaymentDiscount(): number {
    return this.dailyRate * this.requestedEarlyPayment;
  }

  get calculatedAmount(): number {
    return this.invoiceAmount - this.totalEarlyPaymentDiscount;
  }

  getSliderMarkers(): number[] {
    return Array.from({ length: Math.floor(this.paymentTerms / 10) + 1 }, (_, i) => i * 10);
  }
}