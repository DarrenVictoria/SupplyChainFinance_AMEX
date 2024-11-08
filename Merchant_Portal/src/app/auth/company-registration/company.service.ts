import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Company } from './company.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companies: { [key: string]: Company } = {
    'GT001': {
      basicInfo: {
        companyName: {
          arabic: 'شركة التقنية الخضراء المحدودة',
          english: 'Green Tech LLC'
        },
        companyType: 'Limited Liability Company (LLC)',
        legalEntityType: 'Private Company',
        companyStatus: 'Active',
        companyAddress: {
          street: 'King Fahd Road, Building 45',
          city: 'Riyadh',
          province: 'Riyadh Province'
        },
        ownersAndShareholders: [
          { name: 'Khalid Al-Fahad', percentage: 60 },
          { name: 'Ahmad Al-Harbi', percentage: 40 }
        ],
        businessActivities: [
          'IT Solutions',
          'Environmental Technology',
          'Green Energy Solutions'
        ],
        branches: [
          'Riyadh Branch (Headquarters)',
          'Jeddah Branch'
        ],
        vatRegistrationNumber: '3000111222'
      },
      licenseDetails: {
        environmentalTechnologyLicense: '11223344',
        itServicesLicense: '22334455',
        capitalInformation: {
          authorizedCapital: 10000000,
          paidUpCapital: 7500000
        }
      },
      contactInformation: {
        phone: '+966 11 123 4567',
        email: 'info@greentech.com',
        establishmentDate: '10-03-2017'
      },
      boardMembers: [
        { name: 'Khalid Al-Fahad', position: 'CEO & Authorized Signatory' },
        { name: 'Ahmad Al-Harbi', position: 'CFO & Authorized Signatory' }
      ]
    },
    'DT002': {
      basicInfo: {
        companyName: {
          arabic: 'شركة البيانات الرقمية',
          english: 'Digital Data Corporation'
        },
        companyType: 'Joint Stock Company (JSC)',
        legalEntityType: 'Public Company',
        companyStatus: 'Active',
        companyAddress: {
          street: 'Digital City, Block C',
          city: 'Jeddah',
          province: 'Makkah Province'
        },
        ownersAndShareholders: [
          { name: 'Sara Al-Rashid', percentage: 30 },
          { name: 'Mohammed Al-Qasim', percentage: 35 },
          { name: 'Faisal Al-Omar', percentage: 35 }
        ],
        businessActivities: [
          'Data Analytics',
          'Cloud Services',
          'Digital Transformation'
        ],
        branches: [
          'Jeddah HQ',
          'Riyadh Branch',
          'Dammam Branch'
        ],
        vatRegistrationNumber: '3000333444'
      },
      licenseDetails: {
        environmentalTechnologyLicense: '33445566',
        itServicesLicense: '44556677',
        capitalInformation: {
          authorizedCapital: 20000000,
          paidUpCapital: 15000000
        }
      },
      contactInformation: {
        phone: '+966 12 345 6789',
        email: 'contact@digitaldata.com',
        establishmentDate: '15-06-2019'
      },
      boardMembers: [
        { name: 'Sara Al-Rashid', position: 'Chairperson' },
        { name: 'Mohammed Al-Qasim', position: 'CEO' },
        { name: 'Faisal Al-Omar', position: 'COO' }
      ]
    },
    'ST003': {
      basicInfo: {
        companyName: {
          arabic: 'شركة الحلول الذكية',
          english: 'Smart Solutions Co.'
        },
        companyType: 'Limited Liability Company (LLC)',
        legalEntityType: 'Private Company',
        companyStatus: 'Active',
        companyAddress: {
          street: 'Smart Tower, Al Olaya Street',
          city: 'Dammam',
          province: 'Eastern Province'
        },
        ownersAndShareholders: [
          { name: 'Noura Al-Salem', percentage: 50 },
          { name: 'Abdullah Al-Tamimi', percentage: 50 }
        ],
        businessActivities: [
          'Smart Home Solutions',
          'IoT Services',
          'Artificial Intelligence'
        ],
        branches: [
          'Dammam Main Office',
          'Khobar Branch',
          'Jubail Branch'
        ],
        vatRegistrationNumber: '3000555666'
      },
      licenseDetails: {
        environmentalTechnologyLicense: '55667788',
        itServicesLicense: '66778899',
        capitalInformation: {
          authorizedCapital: 5000000,
          paidUpCapital: 5000000
        }
      },
      contactInformation: {
        phone: '+966 13 567 8901',
        email: 'info@smartsolutions.com',
        establishmentDate: '22-09-2020'
      },
      boardMembers: [
        { name: 'Noura Al-Salem', position: 'Managing Director' },
        { name: 'Abdullah Al-Tamimi', position: 'Technical Director' }
      ]
    }
  };

  searchCompany(registrationNumber: string): Observable<Company | null> {
    // Convert to uppercase to make search case-insensitive
    const normalizedRegNumber = registrationNumber.toUpperCase();
    // Add small delay to simulate network request
    return of(this.companies[normalizedRegNumber] || null);
  }
}