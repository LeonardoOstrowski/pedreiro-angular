import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HeaderComponent} from "../../landing/header";

const API_URL = 'http://localhost:8080';

@Component({
    selector: 'app-consultar-servico',
    template: `
        <app-header></app-header>
        <div class="main-container">
            <aside class="sidebar">
                <ul>
                    <li><h1 (click)="navigateTo('/admin/consultar/clientes')">Consultar Clientes</h1></li>
                    <li><h2 (click)="navigateTo('/admin/cadastrar/clientes')">Cadastrar Cliente</h2></li>
                    <li><h2 class="selected" (click)="navigateTo('/admin/consultar/servicos')">Consultar Serviços</h2>
                    </li>
                    <li><h2 (click)="navigateTo('/admin/cadastrar/servico')">Cadastrar Serviço</h2></li>
                    <li><h3 (click)="navigateTo('/')">Home</h3></li>
                </ul>
            </aside>

            <div class="content">
                <div class="search-bar">
                    <input
                            type="text"
                            placeholder="Digite o ID para consulta"
                            [(ngModel)]="searchId"
                    />
                    <button class="search-button" (click)="handleSearch()">Consultar ID</button>
                </div>

                <div *ngIf="loading">Carregando...</div>

                <table class="data-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descrição</th>
                        <th>Data</th>
                        <th>Custo</th>
                        <th>Confirmar</th>
                        <th>Alt</th>
                        <th>Del</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let servico of filteredServicos">
                        <td>{{ servico.id }}</td>
                        <td>
                            <input *ngIf="editingServicoId === servico.id" type="text"
                                   [(ngModel)]="editServicoData.descricao"/>
                            <span *ngIf="editingServicoId !== servico.id">{{ servico.descricao }}</span>
                        </td>
                        <td>
                            <input *ngIf="editingServicoId === servico.id" type="text"
                                   [(ngModel)]="editServicoData.data"/>
                            <span *ngIf="editingServicoId !== servico.id">{{ servico.data | date: 'dd/MM/yyyy' }}</span>
                        </td>
                        <td>
                            <input *ngIf="editingServicoId === servico.id" type="number"
                                   [(ngModel)]="editServicoData.custo"/>
                            <span *ngIf="editingServicoId !== servico.id">{{ servico.custo | number: '1.2-2' }}</span>
                        </td>
                        <td>
                            <button *ngIf="editingServicoId === servico.id" class="confirm-button"
                                    (click)="handleSave(servico.id)">✔️
                            </button>
                            <span *ngIf="editingServicoId !== servico.id">-</span>
                        </td>
                        <td>
                            <button *ngIf="editingServicoId === servico.id" class="cancel-button"
                                    (click)="handleCancelEdit()">❌
                            </button>
                            <button *ngIf="editingServicoId !== servico.id" class="edit-button"
                                    (click)="handleEdit(servico.id)">✏️
                            </button>
                        </td>
                        <td>
                            <button class="delete-button" (click)="excluir(servico.id)">🗑️</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        DatePipe,
        DecimalPipe,
        HeaderComponent,
        NgForOf
    ],
    styleUrls: ['../../../app.component.scss']
})
export class ConsultarServicoComponent implements OnInit {
    servicos: any[] = [];
    filteredServicos: any[] = [];
    searchId: string = '';
    loading: boolean = false;
    editingServicoId: number | null = null;
    editServicoData = { descricao: '', data: '', custo: '' };

    constructor(private router: Router, private http: HttpClient) {}

    ngOnInit(): void {
        if (!localStorage.getItem('TOKEN')) {
            this.router.navigate(['/login']);
        } else {
            this.buscar();
        }
    }

    // Função para navegação
    navigateTo(path: string): void {
        this.router.navigate([path]);
    }

    // Função para buscar serviços
    buscar(): void {
        this.loading = true;
        const token = localStorage.getItem('TOKEN');
        const headers = new HttpHeaders({ 'x-access-token': token || '' });

        this.http.get(`${API_URL}/api/servico`, { headers }).subscribe({
            next: (response: any) => {
                this.servicos = response.map((servico: any) => ({
                    ...servico,
                    custo: parseFloat(servico.custo) || 0
                }));
                this.filteredServicos = this.servicos;
            },
            error: () => {
                alert("Erro ao buscar serviços. Tente novamente.");
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    // Função para excluir serviço
    excluir(id: number): void {
        if (!window.confirm(`Deseja realmente excluir o serviço com ID: ${id}?`)) return;

        this.loading = true;
        const token = localStorage.getItem('TOKEN');
        const headers = new HttpHeaders({ 'x-access-token': token || '' });

        this.http.delete(`${API_URL}/api/servico/delete/${id}`, { headers }).subscribe({
            next: () => {
                this.servicos = this.servicos.filter(servico => servico.id !== id);
                this.filteredServicos = this.filteredServicos.filter(servico => servico.id !== id);
                alert('Serviço excluído');
            },
            error: () => {
                alert("Erro ao excluir serviço. Tente novamente.");
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    // Função para pesquisa por ID
    handleSearch(): void {
        const result = this.servicos.filter(servico => servico.id === parseInt(this.searchId));
        this.filteredServicos = result.length > 0 ? result : this.servicos;
    }

    // Função para editar serviço
    handleEdit(id: number): void {
        const servicoToEdit = this.servicos.find(servico => servico.id === id);
        if (servicoToEdit) {
            this.editServicoData = {
                descricao: servicoToEdit.descricao,
                data: servicoToEdit.data,
                custo: servicoToEdit.custo
            };
        }
        this.editingServicoId = id;
    }

    // Função para cancelar edição
    handleCancelEdit(): void {
        this.editingServicoId = null;
    }

    // Função para salvar alterações
    handleSave(id: number): void {
        if (!this.editServicoData.descricao || !this.editServicoData.data || !this.editServicoData.custo) {
            alert("Todos os campos devem ser preenchidos!");
            return;
        }

        this.loading = true;
        const token = localStorage.getItem('TOKEN');
        const headers = new HttpHeaders({ 'x-access-token': token || '' });

        this.http.put(`${API_URL}/api/servico/update/${id}`, {
            descricao: this.editServicoData.descricao,
            data: this.editServicoData.data,
            custo: parseFloat(this.editServicoData.custo)
        }, { headers }).subscribe({
            next: () => {
                this.servicos = this.servicos.map(servico =>
                    servico.id === id ? { ...servico, ...this.editServicoData } : servico
                );
                this.editingServicoId = null;
                alert('Serviço atualizado com sucesso');
                window.location.reload();
            },
            error: () => {
                alert("Erro ao atualizar serviço. Tente novamente.");
            },
            complete: () => {
                this.loading = false;
            }
        });
    }
}
