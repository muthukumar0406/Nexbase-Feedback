import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { StarRatingComponent } from '../../shared/star-rating.component';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StarRatingComponent],
  template: `
    <div class="form-container glass-panel">
      <h2>We Value Your Feedback</h2>
      <p class="subtitle">Help us improve Nexbase services</p>

      <div *ngIf="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      <div *ngIf="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <form [formGroup]="feedbackForm" (ngSubmit)="onSubmit()" *ngIf="!successMessage">
        <div class="form-group">
          <label>Customer Name</label>
          <input type="text" formControlName="customerName" class="form-control" [class.is-invalid]="isInvalid('customerName')">
          <div class="invalid-feedback" *ngIf="isInvalid('customerName')">Customer Name is required</div>
        </div>

        <div class="form-group">
          <label>Company Name</label>
          <input type="text" formControlName="companyName" class="form-control" [class.is-invalid]="isInvalid('companyName')">
          <div class="invalid-feedback" *ngIf="isInvalid('companyName')">Company Name is required</div>
        </div>

        <div class="form-group">
          <label>Engineer Name</label>
          <input type="text" formControlName="engineerName" class="form-control" [class.is-invalid]="isInvalid('engineerName')">
          <div class="invalid-feedback" *ngIf="isInvalid('engineerName')">Engineer Name is required</div>
        </div>

        <div class="form-group">
          <label>Rating</label>
          <app-star-rating [rating]="feedbackForm.get('rating')?.value" (ratingChange)="feedbackForm.patchValue({rating: $event})"></app-star-rating>
          <div class="invalid-feedback d-block" *ngIf="isInvalid('rating')">Please select a rating</div>
        </div>

        <div class="form-group">
          <label>Feedback</label>
          <textarea formControlName="feedbackText" class="form-control" rows="4" [class.is-invalid]="isInvalid('feedbackText')"></textarea>
          <div class="invalid-feedback" *ngIf="isInvalid('feedbackText')">Feedback is required</div>
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="loading || feedbackForm.invalid">
          <span *ngIf="loading" class="spinner"></span>
          <span *ngIf="!loading">Submit Feedback</span>
        </button>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
    }
  `]
})
export class FeedbackFormComponent {
  feedbackForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.feedbackForm = this.fb.group({
      customerName: ['', Validators.required],
      companyName: ['', Validators.required],
      engineerName: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      feedbackText: ['', Validators.required]
    });
  }

  isInvalid(field: string): boolean {
    const control = this.feedbackForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.submitFeedback(this.feedbackForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Thank you! Your feedback has been submitted successfully.';
        this.feedbackForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error || 'There was an error submitting your feedback. Please try again later.';
        console.error('Submission error:', err);
      }
    });
  }
}
