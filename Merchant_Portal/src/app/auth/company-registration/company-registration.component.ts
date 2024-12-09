import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface CountryCode {
  name: string;
  code: string;
  dial_code: string;
}


@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CompanyRegistrationComponent implements OnInit {
  // Buyer Details
  buyerCode = 'AUTO-GENERATED-001'; // Auto-populated
  buyerCompanyName = 'Example Buyer Company'; // Auto-populated

  countryCodes: CountryCode[] = [
    { name: 'Saudi Arabia', code: 'KSA', dial_code: '+966' },
    { name: 'United States', code: 'US', dial_code: '+1' },
    { name: 'Canada', code: 'CA', dial_code: '+1' },
    { name: 'Australia', code: 'AU', dial_code: '+61' },
    { name: 'Germany', code: 'DE', dial_code: '+49' },
    { name: 'France', code: 'FR', dial_code: '+33' },
    { name: 'India', code: 'IN', dial_code: '+91' },
    { name: 'China', code: 'CN', dial_code: '+86' },
    { name: 'Japan', code: 'JP', dial_code: '+81' }
  ];



  // Updated supplier details
  supplierDetails = {
    companyRegistrationNumber: '',
    companyName: '',
    companyAddress: '',
    selectedCountryCode: '+966',
    mobileNumber: '',
    nationalId: '',
    nafthVerified: false
  };

  // New OTP verification properties
  showOtpModal = false;
  otpInput = '';
  isNafthVerificationLoading = false;
  wathqDetailsValidated = false;
  isWathqValidationLoading = false;


  // IBAN Details
  ibanDetails = {
    completeIban: '',
    country: '',
    bank: ''
  };

  isSanctionScreenLoading = false;
  sanctionScreenStatus: 'Verified' | 'Under Review' | 'Rejected' = 'Under Review';
  sanctionScreenApproved = false;
  sanctionScreenInitiated = false;



  // Stage Management
  currentStage = 1;
  stages = [
    { name: 'Stage 1 : Basic Details', completed: false },
    { name: 'Stage 2 : Contract Verification', completed: false },
    { name: 'Stage 3 : IBAN Verification', completed: false },
    { name: 'Stage 4 : Sanction Screening', completed: false }
  ];

  // Stage flags
  companyDetailsApproved = false;
  documentApproved = false;
  bankDetailsApproved = false;

  isCompanyDetailsLoading = false;
  isDocumentVerificationLoading = false;
  isBankDetailsLoading = false;

  constructor(private router: Router) { }

  ngOnInit() {
    // Any initial setup
    this.loadBuyerDetails();
  }

  // Simulate loading buyer details 
  loadBuyerDetails(): void {
    // In a real application, this would come from a service
    this.buyerCode = 'AUTO-BUYER-' + Math.floor(1000 + Math.random() * 9000);
    this.buyerCompanyName = 'Acme Corporation';
  }

  validateWathqDetails(): void {
    // Validate company registration number
    if (this.supplierDetails.companyRegistrationNumber) {
      this.isWathqValidationLoading = true;

      // Simulate API validation with setTimeout
      setTimeout(() => {
        // In a real scenario, this would be an actual API call
        this.wathqDetailsValidated = true;

        // Optionally pre-fill company name and address
        this.supplierDetails.companyName = 'Example Company Name';
        this.supplierDetails.companyAddress = 'Example Company Address';

        this.isWathqValidationLoading = false;
      }, 2000);
    } else {
      alert('Please enter a Company Registration Number');
    }
  }

  // New method for Nafth API verification
  openNafthVerificationModal(): void {
    this.showOtpModal = true;
  }

  verifyNafthOtp(): void {
    // Simulate OTP verification
    if (this.otpInput === '123456') {
      this.isNafthVerificationLoading = true;
      setTimeout(() => {
        this.supplierDetails.nafthVerified = true;
        this.showOtpModal = false;
        this.companyDetailsApproved = true;
        this.stages[0].completed = true;
        this.isNafthVerificationLoading = false;
      }, 2000);
    } else {
      alert('Invalid OTP. Please try again.');
    }
  }

  // Updated company details validation
  validateCompanyDetails(): boolean {
    return !!(
      this.wathqDetailsValidated &&
      this.supplierDetails.selectedCountryCode &&
      this.supplierDetails.mobileNumber &&
      this.supplierDetails.nationalId
    );
  }


  // Rename method to match the HTML template
  approveCompanyDetails(): void {
    if (this.validateCompanyDetails()) {
      this.isCompanyDetailsLoading = true;
      // Open Nafth OTP modal
      this.showOtpModal = true;
      this.isCompanyDetailsLoading = false;
    } else {
      alert('Please fill in all supplier details');
    }
  }


  // Validate IBAN Details
  validateIbanDetails(): boolean {
    // Add validation logic
    return !!(
      this.ibanDetails.completeIban &&
      this.ibanDetails.country &&
      this.ibanDetails.bank
    );
  }

  // Simulate bank details approval
  approveBankDetails(): void {
    if (this.validateIbanDetails()) {
      this.isBankDetailsLoading = true;
      setTimeout(() => {
        this.bankDetailsApproved = true;
        this.stages[2].completed = true;
        this.isBankDetailsLoading = false;
      }, 2000);
    } else {
      alert('Please fill in all IBAN details');
    }
  }

  // Simulate Sanction Screening
  simulateSanctionScreening(): void {
    this.isSanctionScreenLoading = true;
    setTimeout(() => {
      this.isSanctionScreenLoading = false;
      this.sanctionScreenApproved = true;
      this.stages[3].completed = true;
    }, 2000);
  }

  // Simulate Sanction Screening
  loadSanctionScreening(): void {
    this.isSanctionScreenLoading = true;

    // First, show "Under Review" status with blinking
    setTimeout(() => {
      this.isSanctionScreenLoading = false;

      // Automatically transition to Verified after blinking
      setTimeout(() => {
        this.sanctionScreenStatus = 'Verified';
        this.sanctionScreenApproved = true;
        this.stages[3].completed = true;
      }, 5000); // 5 seconds of blinking
    }, 4000);
  }

  ngDoCheck() {
    if (this.currentStage === 4 && !this.sanctionScreenInitiated) {
      this.initiateSanctionScreening();
    }
  }

  initiateSanctionScreening(): void {
    // Prevent re-initiating if already done
    if (this.sanctionScreenInitiated) return;

    this.isSanctionScreenLoading = true;
    this.sanctionScreenInitiated = true;

    // First, show "Under Review" status with blinking
    setTimeout(() => {
      this.isSanctionScreenLoading = false;

      // Automatically transition to Verified after blinking
      setTimeout(() => {
        this.sanctionScreenStatus = 'Verified';
        this.sanctionScreenApproved = true;
        this.stages[3].completed = true;
      }, 5000); // 5 seconds of blinking
    }, 4000);
  }



  // Stage Navigation
  goToNextStage(): void {
    switch (this.currentStage) {
      case 1:
        if (this.companyDetailsApproved) {
          this.currentStage++;
          this.stages[0].completed = true;
        } else {
          alert('Please verify company details first');
        }
        break;
      case 2:
        if (this.documentApproved) {
          this.currentStage++;
          this.stages[1].completed = true;
        }
        break;
      case 3:
        if (this.bankDetailsApproved) {
          this.currentStage++;
          this.stages[2].completed = true;
        }
        break;
      case 4:
        if (this.sanctionScreenStatus === 'Verified') {
          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        }
        break;
    }
  }

  // Simulate document approval
  simulateDocumentApproval(): void {
    this.isDocumentVerificationLoading = true;
    setTimeout(() => {
      this.documentApproved = true;
      this.stages[1].completed = true;
      this.isDocumentVerificationLoading = false;
    }, 2000);
  }
}