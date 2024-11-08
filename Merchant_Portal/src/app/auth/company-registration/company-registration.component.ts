import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from './company.service';
import { Company } from './company.interface';

@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CompanyRegistrationComponent {
  registrationNumber = '';
  company: Company | null = null;
  registrationDate = new Date().toISOString().split('T')[0];
  queryDate = new Date().toISOString().split('T')[0];
  showResults = false;
  loading = false;
  error: string | null = null;

  constructor(
    private companyService: CompanyService,
    private router: Router
  ) {}

  searchCompany(): void {
    if (!this.registrationNumber.trim()) {
      this.error = 'Please enter a registration number';
      return;
    }

    this.loading = true;
    this.error = null;
    this.showResults = false;
    
    this.companyService.searchCompany(this.registrationNumber)
      .subscribe({
        next: (result) => {
          this.loading = false;
          
          if (!result) {
            this.error = 'No company found with this registration number';
            return;
          }
          
          this.company = result;
          this.showResults = true;
        },
        error: (err) => {
          this.error = 'An error occurred while searching for the company';
          this.loading = false;
          console.error('Company search error:', err);
        }
      });
  }

  registerWithCompany(): void {
    this.router.navigate(['/dashboard']);
  }
  
  // Helper methods to safely access nested properties
  getCompanyName(language: 'arabic' | 'english'): string {
    return this.company?.basicInfo.companyName[language] || 'N/A';
  }

  getCompanyAddress(): string {
    const address = this.company?.basicInfo.companyAddress;
    if (!address) return 'N/A';
    return [address.street, address.city, address.province]
      .filter(Boolean)
      .join(', ') || 'N/A';
  }

  getBusinessActivities(): string[] {
    return this.company?.basicInfo.businessActivities || [];
  }

  getBranches(): string[] {
    return this.company?.basicInfo.branches || [];
  }

  // Optional: Method to check if there are any business activities or branches
  hasBusinessActivities(): boolean {
    return this.getBusinessActivities().length > 0;
  }

  hasBranches(): boolean {
    return this.getBranches().length > 0;
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return 'N/A';
    return `SAR ${amount.toLocaleString()}`;
  }
}
