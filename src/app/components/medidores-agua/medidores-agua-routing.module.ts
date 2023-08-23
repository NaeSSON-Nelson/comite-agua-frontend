import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MedidoresComponent } from './medidores/medidores.component';
import { AfiliadoMedidoresDetailsComponent } from './afiliado-medidores-details/afiliado-medidores-details.component';
import { MedidorFormComponent } from './medidor-form/medidor-form.component';

const routes: Routes = [
  {
    path: 'medidores-list',
    component: MedidoresComponent,
  },
  {
    path:'medidor-details',
    component:AfiliadoMedidoresDetailsComponent,
  },
  {
    path:'medidor-register',
    component:MedidorFormComponent,
  },
  {
    path: '**',
    redirectTo: 'medidores-list',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedidoresAguaRoutingModule { }
