import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedidoresComponent } from './medidores/medidores.component';
import { DeudasComponent } from './deudas/deudas.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PATH_DASHBOARD, ValidItemMenu } from 'src/app/interfaces/routes-app';

const routes: Routes = [
  {
    path: ValidItemMenu.consultarConsultarMedidoresAgua,
    component: MedidoresComponent,
  },
  {
    path:ValidItemMenu.consultarDeudas,
    component:DeudasComponent,
  },
  {
    path:'perfil',
    component:PerfilComponent,
  },
  {
    path: '**',
    redirectTo: PATH_DASHBOARD,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosFuncionesRoutingModule { }
