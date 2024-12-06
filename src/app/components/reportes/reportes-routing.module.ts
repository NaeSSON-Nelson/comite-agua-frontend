import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PATH_DASHBOARD, PATH_NOTFOUND, ValidItemMenu, ValidMenu } from 'src/app/interfaces/routes-app';
import { PagosServicioComponent } from './pagos-servicio/pagos-servicio.component';
import { ListaDeudoresComponent } from './lista-deudores/lista-deudores.component';

const routes: Routes = [
  {
    path:ValidItemMenu.reportesPagosService,
    component:PagosServicioComponent,
  },
  {
    path:ValidItemMenu.reportesDeudores,
    component:ListaDeudoresComponent,
  },
  {
    path: '**',
    redirectTo: PATH_NOTFOUND,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule { }
