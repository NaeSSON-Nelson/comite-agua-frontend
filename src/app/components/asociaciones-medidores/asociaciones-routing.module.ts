import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PATH_LISTAR, PATH_MODULE_DETAILS, ValidItemMenu } from 'src/app/interfaces/routes-app';
import { AsociacionesListarComponent } from './asociaciones-listar/asociaciones-listar.component';
import { AfiliadoMedidoresDetailsComponent } from './afiliado-medidores-details/afiliado-medidores-details.component';

const routes: Routes = [
  //* PATH MEDIDORES DE AGUA
  {
    path: ValidItemMenu.asociacionList,
    component:AsociacionesListarComponent,
  },
  {
    path: `${ValidItemMenu.asociacionesAfiliadoDetails}/:id`,
    component:AfiliadoMedidoresDetailsComponent,
  },
  {
    path: '**',
    redirectTo: PATH_LISTAR,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsociacionesRoutingModule { }
