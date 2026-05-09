import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Feedback } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { StarRatingComponent } from '../../shared/star-rating.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent, DatePipe],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h2>Admin Dashboard</h2>
        <button class="btn btn-secondary" (click)="logout()">Logout</button>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card glass-panel">
          <div class="stat-title">Total Feedback</div>
          <div class="stat-value">{{ feedbacks.length }}</div>
        </div>
        <div class="stat-card glass-panel">
          <div class="stat-title">Average Rating</div>
          <div class="stat-value">{{ averageRating | number:'1.1-1' }} <span style="color:#FFD700">★</span></div>
        </div>
      </div>

      <div class="controls glass-panel">
        <div class="search-box">
          <input type="text" [(ngModel)]="searchTerm" placeholder="Search by name or company..." class="form-control">
        </div>
        <button class="btn btn-primary" (click)="exportToCSV()">Export to CSV</button>
      </div>

      <div class="table-container glass-panel">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Company</th>
              <th>Engineer</th>
              <th>Rating</th>
              <th>Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredFeedbacks">
              <td>{{ item.createdDate | date:'short' }}</td>
              <td>{{ item.customerName }}</td>
              <td>{{ item.companyName }}</td>
              <td>{{ item.engineerName }}</td>
              <td>
                <span class="rating-display">
                  {{ item.rating }} <span style="color:#FFD700">★</span>
                </span>
              </td>
              <td class="feedback-text">{{ item.feedbackText }}</td>
              <td>
                <button class="btn btn-sm btn-danger" (click)="deleteFeedback(item.id!)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="filteredFeedbacks.length === 0">
              <td colspan="7" class="text-center">No feedback found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      padding: 20px;
      text-align: center;
    }
    .stat-title {
      font-size: 1.2rem;
      color: #666;
    }
    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--primary-color);
      margin-top: 10px;
    }
    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      margin-bottom: 20px;
      gap: 20px;
    }
    .search-box {
      flex: 1;
      max-width: 400px;
    }
    .table-container {
      overflow-x: auto;
      padding: 20px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    .table th, .table td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }
    .table th {
      font-weight: 600;
      color: #555;
    }
    .feedback-text {
      max-width: 300px;
      white-space: pre-wrap;
    }
    .rating-display {
      font-weight: bold;
    }
    .text-center {
      text-align: center;
    }
    .btn-sm {
      padding: 6px 12px;
      font-size: 0.875rem;
    }
    .btn-danger {
      background-color: var(--danger-color);
      color: white;
    }
    .btn-danger:hover {
      background-color: #DC2626;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  feedbacks: Feedback[] = [];
  searchTerm = '';

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.apiService.getFeedbacks().subscribe({
      next: (data) => {
        this.feedbacks = data;
      },
      error: (err) => {
        console.error('Error fetching feedbacks', err);
      }
    });
  }

  deleteFeedback(id: number) {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.apiService.deleteFeedback(id).subscribe({
        next: () => {
          this.loadFeedbacks(); // Refresh the list
        },
        error: (err) => {
          console.error('Error deleting feedback', err);
          alert('Could not delete feedback. Please try again.');
        }
      });
    }
  }

  get filteredFeedbacks() {
    if (!this.searchTerm) return this.feedbacks;
    const term = this.searchTerm.toLowerCase();
    return this.feedbacks.filter(f => 
      f.customerName.toLowerCase().includes(term) || 
      f.companyName.toLowerCase().includes(term)
    );
  }

  get averageRating() {
    if (this.feedbacks.length === 0) return 0;
    const sum = this.feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / this.feedbacks.length;
  }

  exportToCSV() {
    const headers = ['Date', 'Customer Name', 'Company Name', 'Engineer Name', 'Rating', 'Feedback'];
    const rows = this.filteredFeedbacks.map(f => [
      new Date(f.createdDate!).toLocaleString(),
      `"${f.customerName}"`,
      `"${f.companyName}"`,
      `"${f.engineerName}"`,
      f.rating,
      `"${f.feedbackText.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'nexbase_feedback.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  logout() {
    this.authService.logout();
  }
}
