import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth/login';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((res: any) => {
        if (res.success) {
          localStorage.setItem('token', 'authenticated');
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  get isAuthenticated$() {
    return this.isAuthenticatedSubject.asObservable();
  }
}
