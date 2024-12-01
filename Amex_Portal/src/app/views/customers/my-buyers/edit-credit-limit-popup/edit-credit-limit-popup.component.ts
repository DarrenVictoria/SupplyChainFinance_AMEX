import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-credit-limit-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-credit-limit-popup.component.html',
  styleUrls: ['./edit-credit-limit-popup.component.scss']
})
export class EditCreditLimitPopupComponent {
  currentCreditLimit: number;
  newCreditLimit: number;

  constructor(
    public dialogRef: MatDialogRef<EditCreditLimitPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentCreditLimit: number }
  ) {
    this.currentCreditLimit = data.currentCreditLimit;
    this.newCreditLimit = data.currentCreditLimit;
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.newCreditLimit = parseFloat(input.value.replace(/[^0-9.-]+/g, '')) || 0;
  }

  save() {
    this.dialogRef.close(this.newCreditLimit);
  }

  cancel() {
    this.dialogRef.close();
  }
}