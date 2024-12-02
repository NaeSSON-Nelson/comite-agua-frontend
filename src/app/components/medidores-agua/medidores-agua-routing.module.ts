import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MedidorFormComponent } from './medidor-form/medidor-form.component';
import { MedidoresListarComponent } from './medidores-listar/medidores-listar.component';
import { MedidorDetailsComponent } from './medidor-details/medidor-details.component';
import { PATH_AFILIADO, PATH_ASOCIACIONES, PATH_EDIT, PATH_LISTAR, PATH_MODULE_DETAILS, PATH_REGISTRAR, ValidItemMenu } from 'src/app/interfaces/routes-app';

const routes: Routes = [
  //* PATH MEDIDORES DE AGUA
  {
    path: ValidItemMenu.medidorList,
    component:MedidoresListarComponent,
  },
  {
    path: ValidItemMenu.medidorRegister,
    component:MedidorFormComponent,
  },
  {
    path:`${ValidItemMenu.medidorUpdate}/:id`,
    component:MedidorFormComponent,
  },
  {
    path: `${ValidItemMenu.medidorDetails}/:id`,
    component:MedidorDetailsComponent,
  },
  {
    path: '**',
    redirectTo: ValidItemMenu.medidorList,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedidoresAguaRoutingModule { }
