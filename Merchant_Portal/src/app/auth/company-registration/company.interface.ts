// company.interface.ts
export interface CompanyName {
    arabic: string;
    english: string;
  }
  
  export interface CompanyAddress {
    street: string;
    city: string;
    province: string;
  }
  
  export interface Owner {
    name: string;
    percentage: number;
  }
  
  export interface BoardMember {
    name: string;
    position: string;
  }
  
  export interface CapitalInformation {
    authorizedCapital: number;
    paidUpCapital: number;
  }
  
  export interface LicenseDetails {
    environmentalTechnologyLicense: string;
    itServicesLicense: string;
    capitalInformation: CapitalInformation;
  }
  
  export interface ContactInformation {
    phone: string;
    email: string;
    establishmentDate: string;
  }
  
  export interface BasicInfo {
    companyName: CompanyName;
    companyType: string;
    legalEntityType: string;
    companyStatus: string;
    companyAddress: CompanyAddress;
    ownersAndShareholders: Owner[];
    businessActivities: string[];
    branches: string[];
    vatRegistrationNumber: string;
  }
  
  export interface Company {
    basicInfo: BasicInfo;
    licenseDetails: LicenseDetails;
    contactInformation: ContactInformation;
    boardMembers: BoardMember[];
  }