import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container glass-panel">
      <div class="login-header">
        <h2>Admin Login</h2>
        <p>Sign in to access the dashboard</p>
      </div>

      <div *ngIf="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Username</label>
          <input type="text" formControlName="username" class="form-control" [class.is-invalid]="isInvalid('username')">
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" formControlName="password" class="form-control" [class.is-invalid]="isInvalid('password')">
        </div>

        <button type="submit" class="btn btn-primary w-100" [disabled]="loading || loginForm.invalid">
          <span *ngIf="loading" class="spinner"></span>
          <span *ngIf="!loading">Login</span>
        </button>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 80px auto;
      padding: 40px;
    }
    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }
    .w-100 {
      width: 100%;
    }
  `]
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
