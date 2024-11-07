import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
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
        <p>Buyer Login</p>
      </div>

      <div class="main-content">
        <div class="form-section">
          <div class="form-container">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label>Username</label>
                <input
                  type="text"
                  formControlName="username"
                  placeholder="Enter Username here"
                />
                <div *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.invalid" 
                     class="error-message">
                  Username is required
                </div>
              </div>

              <div class="form-group">
                <label>Password</label>
                <input
                  type="password"
                  formControlName="password"
                  placeholder="Enter Password here"
                />
                <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid"
                     class="error-message">
                  Password is required
                </div>
              </div>

              <button
                type="submit"
                [disabled]="loginForm.invalid"
                class="login-button">
                Login
              </button>

              <div class="forgot-password">
                <a href="#">Forgot Password?</a>
              </div>
            </form>
          </div>
        </div>

        <div class="logo-section">
          <img src="../../../../logo-login.png" alt="American Express">
        </div>
      </div>

      <div class="footer">
        Green Tape Supply Chain Finance powered by Affno Virtual Market PTE LTD
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.router.navigate(['/homepage']);
    }
  }
}