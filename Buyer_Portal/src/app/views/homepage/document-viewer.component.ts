import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="document-viewer">
      <div class="header">
        <h2>{{ data.currentIndex + 1 }}/{{ data.documents.length }} - {{ getCurrentDocument().name }}</h2>
        <button mat-icon-button (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="content">
        <!-- Placeholder for document preview -->
        <div class="document-preview">
          <h3>{{ getCurrentDocument().fileName }}</h3>
          <!-- Add your document preview component here -->
        </div>
      </div>
      
      <div class="navigation">
        <button mat-button (click)="previous()" [disabled]="data.currentIndex === 0">
          <mat-icon>chevron_left</mat-icon> Previous
        </button>
        <button mat-button (click)="next()" [disabled]="data.currentIndex === data.documents.length - 1">
          Next <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .document-viewer {
      padding: 1rem;
      max-width: 800px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e0e0e0;

      h2 {
        margin: 0;
      }
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0;
      min-height: 400px;
    }

    .document-preview {
      background: #f5f5f5;
      padding: 2rem;
      border-radius: 4px;
      text-align: center;
    }

    .navigation {
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }
  `]
})
export class DocumentViewerComponent {
  constructor(
    public dialogRef: MatDialogRef<DocumentViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      documents: any[];
      currentIndex: number;
    }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  getCurrentDocument(): any {
    return this.data.documents[this.data.currentIndex];
  }

  next(): void {
    if (this.data.currentIndex < this.data.documents.length - 1) {
      this.data.currentIndex++;
    }
  }

  previous(): void {
    if (this.data.currentIndex > 0) {
      this.data.currentIndex--;
    }
  }
}