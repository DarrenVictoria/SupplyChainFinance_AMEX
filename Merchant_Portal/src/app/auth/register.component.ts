import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
    }

    .container {
      max-width: 800px;
      margin: 40px auto;
    }

    .header {
      background-color: #006fcf;
      color: white;
      padding: 15px;
      border-top-left-radius: 0;
      border-top-right-radius: 20px;
      text-align: center;
    }

    .header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }

    .header p {
      margin: 5px 0 0;
      font-size: 14px;
    }

    .main-content {
      display: flex;
      background: white;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form-section {
      flex: 1;
      padding: 30px;
      display: flex;
      justify-content: center;
    }

    .form-container {
      width: 100%;
      max-width: 320px;
    }

    .logo-section {
      width: 200px;
      background-color: #f8f9fa;
      border-left: 1px solid #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .logo-section img {
      max-width: 150px;
      width: 100%;
    }

    .form-group {
      position: relative;
      margin-bottom: 20px;
    }

    .form-group label {
      position: absolute;
      top: -8px;
      left: 10px;
      background: white;
      padding: 0 5px;
      font-size: 12px;
      color: #666;
    }

    .form-group input {
      width: 100%;
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      outline: none;
    }

    .form-group input:focus {
      border-color: #006fcf;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
    }

    .login-button {
      width: 100%;
      padding: 12px;
      background-color: #006fcf;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      margin-top: 20px;
    }

    .login-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .login-button:hover:not(:disabled) {
      background-color: #005cb2;
    }

    .forgot-password {
      text-align: center;
      margin-top: 15px;
    }

    .forgot-password a {
      color: #006fcf;
      text-decoration: none;
      font-size: 14px;
    }

    .footer {
      margin-top: 20px;
      background-color: #006fcf;
      color: white;
      padding: 12px;
      text-align: center;
      border-top-left-radius: 20px;
      border-bottom-right-radius: 20px;
      font-size: 14px;
    }

    .modal {
      display: none;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.4);
    }

    .modal-dialog {
      max-width: 400px;
      margin: 1.75rem auto;
    }

    .modal-content {
      background-color: #fefefe;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
      border-radius: 10px;
      
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #e9ecef;
    }

    .modal-title {
      margin-bottom: 0;
      line-height: 1.5;
    }

    .modal-body {
      position: relative;
      flex: 1 1 auto;
      padding: 15px;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 15px;
      border-top: 1px solid #e9ecef;
    }

    .btn {
      display: inline-block;
      font-weight: 400;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      border: 1px solid transparent;
      padding: 0.175rem 0.75rem;
      margin-left: 5px;
      font-size: 1rem;
      line-height: 1.5;
      border-radius: 0.25rem;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .btn-secondary {
      color: #212529;
      background-color: #e9ecef;
      border-color: #e9ecef;
    }

    .btn-primary {
      color: #fff;
      background-color: #007bff;
      border-color: #007bff;
    }

    @media (max-width: 768px) {
      .container {
        margin: 20px auto;
      }

      .main-content {
        flex-direction: column;
      }

      .logo-section {
        width: 100%;
        border-left: none;
        border-bottom: 1px solid #e9ecef;
        padding: 20px;
        order: -1; /* Makes logo appear above the form */
      }

      .logo-section img {
        max-width: 120px;
      }

      .form-section {
        padding: 20px;
      }

      .form-container {
        max-width: 280px;
      }
    }
  `],
  template: `
    <div class="container">
      <div class="header">
        <h2>Supply Chain Finance</h2>
        <p>Merchant Register</p>
      </div>

      <div class="main-content">
        <div class="form-section">
          <div class="form-container">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label>Corporate Email</label>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="Enter Username here"
                />
                <div
                  *ngIf="
                    registerForm.get('email')?.touched &&
                    registerForm.get('email')?.invalid
                  "
                  class="error-message"
                >
                  Valid email is required
                </div>
              </div>

              <div class="form-group">
                <label>Password</label>
                <input
                  type="password"
                  formControlName="password"
                  placeholder="Enter Password here"
                />
                <div
                  *ngIf="
                    registerForm.get('password')?.touched &&
                    registerForm.get('password')?.invalid
                  "
                  class="error-message"
                >
                  Password is required
                </div>
              </div>

              <div class="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  formControlName="confirmPassword"
                  placeholder="Confirm Password here"
                />
                <div
                  *ngIf="
                    registerForm.get('confirmPassword')?.touched &&
                    registerForm.get('confirmPassword')?.invalid
                  "
                  class="error-message"
                >
                  Confirm password is required
                </div>
              </div>

              <button
                type="submit"
                [disabled]="registerForm.invalid"
                class="login-button"
              >
                Register
              </button>

              <div class="forgot-password space-y-2">
                <a href="/login" class="block">Already a member? Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="footer">
        Green Tape Supply Chain Finance powered by Affno Virtual Market PTE LTD
      </div>

      <!-- OTP Modal -->
      <div class="modal" id="otpModal" tabindex="-1" role="dialog" aria-hidden="true" [style.display]="showModal ? 'block' : 'none'">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">OTP Verification</h5>
              <button type="button" class="close" (click)="closeModal()" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>We've sent a verification code to: <strong>{{ registerForm.get('email')?.value }}</strong></p>
              <div class="form-group">
                <label for="otpInput">Enter OTP:</label>
                <input type="text" class="form-control" id="otpInput" maxlength="6" required>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="activateAccount()">Activate Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Show the OTP modal
      this.showModal = true;
    }
  }

  closeModal() {
    this.showModal = false;
  }

  activateAccount() {
    const otpInput = document.getElementById('otpInput') as HTMLInputElement;
    const otp = otpInput.value;

    // Validate the OTP (you can use a random 6-digit number for this example)
    if (otp === '123456') {
      // Redirect to the company registration page
      this.router.navigate(['/company-registration']);
    } else {
      // Show an error message or handle the invalid OTP
      alert('Invalid OTP. Please try again.');
    }

    // Close the modal
    this.closeModal();
  }
}