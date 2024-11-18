import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {FormsModule, NgForm} from '@angular/forms';
import {HeaderComponent} from "../../landing/header";
import {NgForOf} from "@angular/common";

const API_URL = 'http://localhost:8080';

@Component({
  selector: 'app-cadastrar-cliente',
  template: `
    <app-header></app-header>
    <div class="main-container">
      <aside class="sidebar">
        <ul>
          <li>
            <h1 (click)="navigateTo('/admin/consultar/clientes')">Consultar Clientes</h1>
          </li>
          <li>
            <h2 class="selected" (click)="navigateTo('/admin/cadastrar/clientes')">Cadastrar Cliente</h2>
          </li>
          <li>
            <h2 (click)="navigateTo('/admin/consultar/servicos')">Consultar Serviços</h2>
          </li>
          <li>
            <h2 (click)="navigateTo('/admin/cadastrar/servico')">Cadastrar Serviço</h2>
          </li>
          <li>
            <h3 (click)="navigateTo('/')">Home</h3>
          </li>
        </ul>
      </aside>

      <div class="content">
        <form #clienteForm="ngForm" (ngSubmit)="handleSubmit(clienteForm)">
          <div class="form-group">
            <label>Nome:</label>
            <input
              type="text"
              [(ngModel)]="name"
              name="name"
              required
            />
          </div>

          <div class="form-group">
            <label>Serviço:</label>
            <select [(ngModel)]="servicoId" name="servicoId" required>
              <option value="">Selecione um serviço</option>
              <option *ngFor="let service of services" [value]="service.id">
                {{ service.descricao }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Endereço:</label>
            <input
              type="text"
              [(ngModel)]="address"
              name="address"
              required
            />
          </div>

          <div class="form-group">
            <label>Telefone:</label>
            <input
              type="text"
              [(ngModel)]="phone"
              name="phone"
              required
            />
          </div>

          <div class="form-group">
            <label>CPF:</label>
            <input
              type="text"
              [(ngModel)]="cpf"
              name="cpf"
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
    HeaderComponent,
    NgForOf
  ],
  styleUrls: ['../../../app.component.scss']
})
export class CadastrarClienteComponent implements OnInit {
  name: string = '';
  servicoId: string = '';
  address: string = '';
  phone: string = '';
  cpf: string = '';
  loading: boolean = false;
  services: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    if (!localStorage.getItem('TOKEN')) {
      this.router.navigate(['/login']);
    } else {
      this.fetchServices();
    }
  }

  fetchServices(): void {
    const token = localStorage.getItem('TOKEN');
    const headers = new HttpHeaders().set('x-access-token', token || '');

    this.http.get<any[]>(`${API_URL}/api/servico`, { headers }).subscribe(
      (data) => {
        this.services = data;
      },
      (error) => {
        console.error('Erro ao buscar serviços:', error);
        alert('Erro ao carregar serviços.');
      }
    );
  }

  handleSubmit(form: NgForm): void {
    if (form.invalid) {
      alert('Todos os campos devem ser preenchidos corretamente!');
      return;
    }

    if (!this.validateCPF(this.cpf)) {
      alert('CPF inválido!');
      return;
    }

    this.loading = true;

    const body = {
      nome: this.name,
      servicoId: this.servicoId,
      endereco: this.address,
      telefone: this.phone,
      cpf: this.cpf
    };

    const token = localStorage.getItem('TOKEN');
    const headers = new HttpHeaders().set('x-access-token', token || '');

    this.http.post(`${API_URL}/api/clientes`, body, { headers }).subscribe(
      () => {
        alert('Cliente cadastrado com sucesso!');
        this.router.navigate(['/admin/consultar/clientes']);
      },
      (error) => {
        console.error('Erro ao cadastrar cliente:', error);
        alert(`Erro ao cadastrar cliente: ${error.error?.error}`);
      },
      () => {
        this.loading = false;
      }
    );
  }


  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // Função para validar CPF
  validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove qualquer caractere não numérico

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os números são iguais (ex: 111.111.111.11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Calcula os dois últimos dígitos verificadores
    let sum = 0;
    let remainder: number;

    // Cálculo do primeiro dígito verificador
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    // Cálculo do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
  }


}

