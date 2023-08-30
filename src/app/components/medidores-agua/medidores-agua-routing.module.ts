import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MedidoresComponent } from './medidores/medidores.component';
import { AfiliadoMedidoresDetailsComponent } from './afiliado-medidores-details/afiliado-medidores-details.component';
import { MedidorFormComponent } from './medidor-form/medidor-form.component';

const routes: Routes = [
  {
    path: 'medidor-agua-list',
    component: MedidoresComponent,
  },
  {
    path:'medidor-agua-details',
    component:AfiliadoMedidoresDetailsComponent,
  },
  {
    path:'medidor-agua-register',
    component:MedidorFormComponent,
  },
  {
    path: '**',
    redirectTo: 'medidor-agua-list',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedidoresAguaRoutingModule { }
