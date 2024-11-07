import { Component, OnInit, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DocumentViewerComponent } from './document-viewer.component';


interface CompanyData {
  companyName: string;
  basicDetails: {
    companyType: string;
    registrationNo: string;
    email: string;
    address: string;
    phone: string;
    website: string;
  };
  accountDetails: {
    cardNumber: string;
    totalCreditLimit: string;
    availableCreditLimit: string;
  };
  documents: {
    name: string;
    fileName: string;
    fileUrl?: string;
  }[];
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class HomepageComponent implements OnInit {
  isMobile: boolean = window.innerWidth <= 768;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }
  

  companyData: CompanyData = {
    companyName: 'Tytan Holdings',
    basicDetails: {
      companyType: 'Private Limited Company',
      registrationNo: '35648328482022',
      email: 'john@tyranmail.com',
      address: '1234 Rex Street\nSpringfield, IL 67204\nUnited States',
      phone: '+966 123 4567',
      website: 'www.tyranhost.com'
    },
    accountDetails: {
      cardNumber: '37XX XXXXXX XXXXX',
      totalCreditLimit: '600,000 USD',
      availableCreditLimit: '200,000 USD'
    },
    documents: [
      {
        name: 'Personal Profile',
        fileName: 'profile-config.txt.mdx',
        fileUrl: 'assets/documents/profile.pdf'
      },
      {
        name: 'Basic Operation',
        fileName: 'basic_operation.pdf',
        fileUrl: 'assets/documents/operation.pdf'
      },
      {
        name: 'Documents Required',
        fileName: 'docs_required.pdf',
        fileUrl: 'assets/documents/required.pdf'
      }
    ]
  };

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  viewDocument(index: number): void {
    this.dialog.open(DocumentViewerComponent, {
      width: '90vw',
      maxWidth: '800px',
      height: '90vh',
      data: {
        documents: this.companyData.documents,
        currentIndex: index
      }
    });
  }

  viewAllDocuments(): void {
    this.viewDocument(0);
  }
}