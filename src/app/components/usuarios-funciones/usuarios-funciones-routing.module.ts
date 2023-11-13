import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedidoresComponent } from './medidores/medidores.component';
import { DeudasComponent } from './deudas/deudas.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  {
    path: 'medidores',
    component: MedidoresComponent,
  },
  {
    path:'deudas',
    component:DeudasComponent,
  },
  {
    path:'perfil',
    component:PerfilComponent,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosFuncionesRoutingModule { }
