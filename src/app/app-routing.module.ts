import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login";
import {LandingComponent} from "./components/landing";
import {CadastrarClienteComponent} from "./components/admin/cliente/CadastrarCliente";
import {ConsultarClienteComponent} from "./components/admin/cliente/ConsultarCliente";
import {CadastrarServicoComponent} from "./components/admin/servico/CadastrarServico";
import {ConsultarServicoComponent} from "./components/admin/servico/ConsultarServico";

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin/cadastrar/clientes',
    component: CadastrarClienteComponent
  },
  {
    path: 'admin/consultar/clientes',
    component: ConsultarClienteComponent
  },
  {
    path: 'admin/consultar/servicos',
    component: ConsultarServicoComponent
  },
  {
    path: 'admin/cadastrar/servico',
    component: CadastrarServicoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
