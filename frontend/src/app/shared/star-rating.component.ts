import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="star-rating">
      <span *ngFor="let star of stars; let i = index" 
            (click)="setRating(i + 1)"
            [class.active]="i < rating"
            class="star">
        ★
      </span>
    </div>
  `,
  styles: [`
    .star-rating {
      display: flex;
      gap: 5px;
      font-size: 2rem;
      cursor: pointer;
    }
    .star {
      color: #ccc;
      transition: color 0.2s ease;
    }
    .star.active {
      color: #FFD700;
    }
    .star:hover {
      transform: scale(1.1);
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Output() ratingChange = new EventEmitter<number>();
  stars = Array(5).fill(0);

  setRating(value: number) {
    this.rating = value;
    this.ratingChange.emit(this.rating);
  }
}
