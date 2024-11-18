import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import {HeaderComponent} from "../../landing/header";

const API_URL = 'http://localhost:8080';

@Component({
  selector: 'app-consultar-cliente',
  template: `
    <app-header></app-header>
    <div class="main-container">
      <aside class="sidebar">
        <ul>
          <li><h1 class="selected" (click)="navigateTo('/admin/consultar/clientes')">Consultar Clientes</h1></li>
          <li><h2 (click)="navigateTo('/admin/cadastrar/clientes')">Cadastrar Cliente</h2></li>
          <li><h2 (click)="navigateTo('/admin/consultar/servicos')">Consultar Serviços</h2></li>
          <li><h2 (click)="navigateTo('/admin/cadastrar/servico')">Cadastrar Serviço</h2></li>
          <li><h3 (click)="navigateTo('/')">Home</h3></li>
        </ul>
      </aside>

      <div class="content">
        <div class="search-bar">
          <input type="text" [(ngModel)]="searchName" placeholder="Digite o nome para consulta"/>
          <button class="search-button" (click)="handleSearch()">Consultar Nome</button>
        </div>

        <div *ngIf="loading">Carregando...</div>

        <table class="data-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Serviço</th>
            <th>Endereço</th>
            <th>Telefone</th>
            <th>CPF</th>
            <th>Confirmar</th>
            <th>Alt</th>
            <th>Del</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let client of filteredClients">
            <td>{{ client.id }}</td>
            <td>
              <ng-container *ngIf="editingClientId === client.id">
                <input [(ngModel)]="editClientData.nome"/>
              </ng-container>
              <ng-container *ngIf="editingClientId !== client.id">
                {{ client.nome }}
              </ng-container>
            </td>
            <td>
              <ng-container *ngIf="editingClientId === client.id">
                <input [(ngModel)]="editClientData.servicoId"/>
              </ng-container>
              <ng-container *ngIf="editingClientId !== client.id">
                {{ getServicoDescricao(client.servicoId) }}
              </ng-container>
            </td>
            <td>
              <ng-container *ngIf="editingClientId === client.id">
                <input [(ngModel)]="editClientData.endereco"/>
              </ng-container>
              <ng-container *ngIf="editingClientId !== client.id">
                {{ client.endereco }}
              </ng-container>
            </td>
            <td>
              <ng-container *ngIf="editingClientId === client.id">
                <input [(ngModel)]="editClientData.telefone"/>
              </ng-container>
              <ng-container *ngIf="editingClientId !== client.id">
                {{ client.telefone }}
              </ng-container>
            </td>
            <td>
              <ng-container *ngIf="editingClientId === client.id">
                <input [(ngModel)]="editClientData.cpf"/>
              </ng-container>
              <ng-container *ngIf="editingClientId !== client.id">
                {{ client.cpf }}
              </ng-container>
            </td>
            <td>
              <button *ngIf="editingClientId === client.id" class="confirm-button" (click)="handleSave(client.id)">✔️</button>
              <span *ngIf="editingClientId !== client.id">-</span>
            </td>
            <td>
              <button *ngIf="editingClientId === client.id" class="cancel-button" (click)="handleCancelEdit()">❌</button>
              <button *ngIf="editingClientId !== client.id" class="edit-button" (click)="handleEdit(client.id)">✏️</button>
            </td>
            <td>
              <button class="delete-button" (click)="excluir(client.id)">🗑️</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, HeaderComponent],
  styleUrls: ['../../../app.component.scss']
})
export class ConsultarClienteComponent implements OnInit {
  clients: any[] = [];
  filteredClients: any[] = [];
  searchName: string = '';
  services: any[] | undefined = [];
  loading: boolean = false;
  editingClientId: number | null = null;
  editClientData: any = { nome: '', servicoId: '', endereco: '', telefone: '', cpf: '' };

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    if (!localStorage.getItem('TOKEN')) {
      this.router.navigate(['/login']);
    } else {
      this.buscar();
    }
  }

  buscar(): void {
    this.loading = true;
    const token = localStorage.getItem('TOKEN') || '';
    const headers = new HttpHeaders({ 'x-access-token': token });

    // Buscar clientes e serviços
    this.http.get(`${API_URL}/api/clientes`, { headers }).subscribe({
      next: (response: any) => {
        console.log('Resposta da API de clientes:', response);
        this.clients = response;
        this.filteredClients = response;
      },
      error: () => alert("Erro ao buscar clientes."),
      complete: () => (this.loading = false)
    });

    this.http.get(`${API_URL}/api/servico`, { headers }).subscribe({
      next: (response: any) => {
        this.services = response.map((servico: any) => ({
          ...servico,
          custo: parseFloat(servico.custo) || 0
        }));
      },
      error: () => alert("Erro ao buscar serviços."),
      complete: () => (this.loading = false)
    });
  }

  excluir(id: number): void {
    if (!window.confirm(`Deseja realmente excluir o cliente com ID: ${id}?`)) return;

    this.loading = true;
    const token = localStorage.getItem('TOKEN') || '';
    const headers = new HttpHeaders().set('x-access-token', token);

    this.http.delete(`${API_URL}/api/clientes/delete/${id}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Erro ao excluir cliente:', error);
          alert('Erro ao excluir cliente.');
          return of(null);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe(() => {
        this.clients = this.clients.filter(client => client.id !== id);
        this.filteredClients = this.filteredClients.filter(client => client.id !== id);
        alert('Registro excluído');
      });
  }

  handleSearch(): void {
    const result = this.clients.filter(client =>
      client.nome.toLowerCase().includes(this.searchName.toLowerCase())
    );
    this.filteredClients = result.length > 0 ? result : this.clients;
  }

  handleSave(id: number): void {
    if (!this.editClientData.nome || !this.editClientData.servicoId ||
      !this.editClientData.endereco || !this.editClientData.telefone ||
      !this.editClientData.cpf) {
      alert("Todos os campos devem ser preenchidos!");
      return;
    }

    if (!this.validateCPF(this.editClientData.cpf)) {
      alert('CPF inválido!');
      return;
    }

    this.loading = true;
    const token = localStorage.getItem('TOKEN') || '';
    const headers = new HttpHeaders().set('x-access-token', token);

    this.http.put(`${API_URL}/api/clientes/update/${id}`, this.editClientData, { headers })
      .pipe(
        catchError(error => {
          console.error('Erro ao atualizar cliente:', error);
          alert('Erro ao atualizar cliente.');
          return of(null);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe(() => {
        this.clients = this.clients.map(client =>
          client.id === id ? { ...client, ...this.editClientData } : client
        );
        this.editingClientId = null;
        alert('Registro atualizado com sucesso');
        window.location.reload();
      });
  }

  handleEdit(id: number): void {
    const clientToEdit = this.clients.find(client => client.id === id);
    if (clientToEdit) {
      this.editClientData = { ...clientToEdit };
    }
    this.editingClientId = id;
  }

  handleCancelEdit(): void {
    this.editingClientId = null;
  }

  getServicoDescricao(servicoId: number): string {
    const servico = this.services?.find(service => service.id === servicoId);
    return servico ? servico.descricao : 'Serviço não encontrado';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // Validação de CPF
  validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let check1 = (sum * 10) % 11 % 10;
    if (check1 !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    let check2 = (sum * 10) % 11 % 10;
    return check2 === parseInt(cpf[10]);
  }
}
