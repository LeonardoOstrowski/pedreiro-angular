import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import {HeaderComponent} from "../../landing/header";

const API_URL = 'http://localhost:8080';

@Component({
  selector: 'app-cadastrar-servico',
  template: `
    <app-header></app-header>
    <div class="main-container">
      <aside class="sidebar">
        <ul>
          <li><h1 (click)="navigateTo('/admin/consultar/clientes')">Consultar Clientes</h1></li>
          <li><h2 (click)="navigateTo('/admin/cadastrar/clientes')">Cadastrar Cliente</h2></li>
          <li><h2 (click)="navigateTo('/admin/consultar/servicos')">Consultar Serviços</h2></li>
          <li><h2 class="selected" (click)="navigateTo('/admin/cadastrar/servico')">Cadastrar Serviço</h2></li>
          <li><h3 (click)="navigateTo('/')">Home</h3></li>
        </ul>
      </aside>

      <div class="content">
        <form (ngSubmit)="handleSubmit()">
          <div class="form-group">
            <label>Descrição do Serviço:</label>
            <input
              type="text"
              [(ngModel)]="description"
              name="description"
              required
            />
          </div>

          <div class="form-group">
            <label>Custo:</label>
            <input
              type="number"
              [(ngModel)]="price"
              name="price"
              required
            />
          </div>

          <div class="form-group">
            <label>Data:</label>
            <input
              type="date"
              [(ngModel)]="date"
              name="date"
              required
            />
          </div>

          <button type="submit" class="cadastrar-button" [disabled]="loading">
            {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
          </button>
        </form>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    FormsModule,
    HeaderComponent
  ],
  styleUrls: ['../../../app.component.scss']
})
export class CadastrarServicoComponent implements OnInit {
  description: string = '';
  price: string = '';
  date: string = '';
  loading: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    if (!localStorage.getItem('TOKEN')) {
      this.router.navigate(['/login']);
    }
  }

  // Navegação
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  // Função para o envio do formulário
  handleSubmit(): void {
    this.loading = true;

    if (!this.description || !this.price || !this.date) {
      alert('Todos os campos devem ser preenchidos corretamente!');
      this.loading = false;
      return;
    }

    const body = {
      descricao: this.description,
      custo: this.price,
      data: this.date
    };

    const token = localStorage.getItem('TOKEN');
    const headers = new HttpHeaders({ 'x-access-token': token || '' });

    this.http.post(`${API_URL}/api/servico`, body, { headers })
      .subscribe({
        next: () => {
          alert('Serviço cadastrado com sucesso!');
          this.router.navigate(['/admin/consultar/servicos']);
        },
        error: (error) => {
          console.error("Erro ao cadastrar serviço:", error);
          alert(`Erro ao cadastrar serviço: ${error.message}`);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}
