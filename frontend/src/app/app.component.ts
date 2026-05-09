import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <header class="app-header glass-panel">
      <div class="logo">
        <span class="logo-accent">Nex</span>base Feedback
      </div>
      <nav>
        <a routerLink="/" class="nav-link">Home</a>
        <a routerLink="/admin" class="nav-link">Admin</a>
      </nav>
    </header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-header {
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(20px);
    }
    .logo {
      font-size: 1.6rem;
      font-weight: 800;
      color: #F8FAFC;
      letter-spacing: -0.05em;
    }
    .logo-accent {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    nav {
      display: flex;
      gap: 24px;
    }
    .nav-link {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      padding: 8px 16px;
      border-radius: 8px;
    }
    .nav-link:hover {
      color: #F8FAFC;
      background: rgba(255, 255, 255, 0.05);
    }
    .main-content {
      min-height: calc(100vh - 100px);
      padding: 24px;
    }
    @media (max-width: 600px) {
      .app-header {
        flex-direction: column;
        padding: 16px;
        gap: 16px;
      }
      nav {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }
      .main-content {
        padding: 12px;
      }
    }
  `]
})
export class AppComponent {
  title = 'frontend';
}
