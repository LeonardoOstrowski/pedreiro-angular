import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header>
      <div class="container">
        <img src="https://imgur.com/ytKEGf8.png" alt="logo" class="header-logo" (click)="handleHomeClick()">
        <nav class="nav">
          <a href="#biografia">Biografia</a>
          <a href="#servicos">Serviços</a>
          <a href="#contato">Contato</a>
        </nav>
        <button class="login-button" (click)="handleLoginLogoutClick()">
          {{ isLoggedIn ? "Deslogar" : "Login" }}
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  isLoggedIn = false;

  constructor(private router: Router) {
    const token = localStorage.getItem('TOKEN');
    this.isLoggedIn = !!token;
  }

  handleLoginLogoutClick() {
    const token = localStorage.getItem('TOKEN');
    if (token) {
      localStorage.removeItem('TOKEN');
      this.isLoggedIn = false;
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  handleHomeClick() {
    this.router.navigate(['/']);
  }
}
