import { Routes } from '@angular/router';
import { FeedbackFormComponent } from './features/feedback-form/feedback-form.component';
import { AdminLoginComponent } from './features/admin-login/admin-login.component';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: FeedbackFormComponent },
  { path: 'admin', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
