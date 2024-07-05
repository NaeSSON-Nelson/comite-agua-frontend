import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MedidoresComponent } from './medidores/medidores.component';
import { AfiliadoMedidoresDetailsComponent } from './afiliado-medidores-details/afiliado-medidores-details.component';
import { MedidorFormComponent } from './medidor-form/medidor-form.component';
import { MedidoresListarComponent } from './medidores-listar/medidores-listar.component';
import { MedidorDetailsComponent } from './medidor-details/medidor-details.component';
import { AsociarMedidorComponent } from './asociar-medidor/asociar-medidor.component';
import { PATH_AFILIADO, PATH_EDIT, PATH_LISTAR, PATH_MODULE_DETAILS, PATH_REGISTRAR } from 'src/app/interfaces/routes-app';

const routes: Routes = [
  //* PATH MEDIDORES DE AGUA
  {
    path: PATH_LISTAR,
    component:MedidoresListarComponent,
  },
  {
    path: PATH_REGISTRAR,
    component:MedidorFormComponent,
  },
  {
    path:`${PATH_REGISTRAR}/${PATH_EDIT}/:id`,
    component:MedidorFormComponent,
  },
  {
    path: `${PATH_MODULE_DETAILS}/:id`,
    component:MedidorDetailsComponent,
  },
  //* PATH AFILIADOS
  
  {
    path: `${PATH_AFILIADO}`,
    component: MedidoresComponent,
  },
  // {
  //   path: `${PATH_AFILIADO}/${PATH_REGISTRAR}`,
  //   component:AsociarMedidorComponent,
  // },
  {
    path: `${PATH_AFILIADO}/${PATH_MODULE_DETAILS}/:id`,
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
export class MedidoresAguaRoutingModule { }
