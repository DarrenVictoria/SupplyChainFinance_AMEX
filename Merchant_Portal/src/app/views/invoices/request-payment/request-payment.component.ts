import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  annualRate: number = 20;
  showConfirmModal: boolean = false;

  constructor(private router: Router) { }

  get requestedEarlyPayment(): number {
    return this.paymentTerms - this.earlyPaymentDay;
  }

  get dailyRate(): number {
    return Math.floor(((this.annualRate * 0.01) / 365) * 1000000) / 1000000;
  }

  get totalEarlyPaymentDiscount(): number {
    return this.dailyRate * this.invoiceAmount * this.requestedEarlyPayment;
  }

  get calculatedAmount(): number {
    return this.invoiceAmount - this.totalEarlyPaymentDiscount;
  }

  getSliderMarkers(): number[] {
    return Array.from({ length: Math.floor(this.paymentTerms / 10) + 1 }, (_, i) => i * 10);
  }

  onEarlyPaymentDayChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement?.value;

    if (value) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= this.paymentTerms) {
        this.earlyPaymentDay = numValue;
      }
    }
  }

  requestPayment() {
    this.showConfirmModal = true;
  }

  closeModal() {
    this.showConfirmModal = false;
  }

  confirmPayment() {
    // Here you would typically call a service to submit the payment request
    console.log('Payment requested with details:', {
      invoiceAmount: this.invoiceAmount,
      earlyPaymentDay: this.earlyPaymentDay,
      calculatedAmount: this.calculatedAmount
    });
    this.router.navigate(['/invoices']);
  }
}