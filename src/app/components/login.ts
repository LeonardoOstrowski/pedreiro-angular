import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {HeaderComponent} from "./landing/header";
import {FooterComponent} from "./landing/footer";

const API_URL = 'http://localhost:8080';

@Component({
  selector: 'app-login',
  template: `
    <app-header></app-header>
    <div class="login-form">
      <form #loginForm="ngForm" (ngSubmit)="logar(loginForm)">
        <label>Login</label>
        <input
          type="text"
          [(ngModel)]="login"
          name="login"
          required
        />
        <label>Senha</label>
        <input
          type="password"
          [(ngModel)]="senha"
          name="senha"
          required
        />
        <button type="submit">
          Entrar
        </button>
      </form>
    </div>
    <app-footer></app-footer>
  `,
  styleUrls: ['../app.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    HeaderComponent,
    FooterComponent,
  ]
})
export class LoginComponent {
  login: string = '';
  senha: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  logar(form: NgForm): void {
    if (form.invalid) {
      alert('Preencha todos os campos!');
      return;
    }

    const body = {
      name: this.login,
      password: this.senha
    };

    this.http.post<any>(`${API_URL}/api/users/login`, body).subscribe(
      (resp) => {
        localStorage.setItem('TOKEN', resp.token);
        this.router.navigate(['/admin/consultar/clientes']);
      },
      (err) => {
        if (err.error && err.error.error) {
          switch (err.error.error) {
            case 'Usuário ou senha incorretos':
              alert('Usuário ou senha incorretos');
              break;
            case 'Usuário não encontrado':
              alert('Usuário não encontrado');
              break;
            default:
              alert('Ocorreu um erro ao processar o login.');
              break;
          }
        } else {
          alert('Autenticação sem sucesso.');
        }
      }
    );
  }
}
