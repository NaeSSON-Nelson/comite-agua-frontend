import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MedidoresComponent } from './medidores/medidores.component';
import { AfiliadoMedidoresDetailsComponent } from './afiliado-medidores-details/afiliado-medidores-details.component';
import { MedidorFormComponent } from './medidor-form/medidor-form.component';

const routes: Routes = [
  {
    path: '',
    component: MedidoresComponent,
  },
  {
    path:'details',
    component:AfiliadoMedidoresDetailsComponent,
  },
  {
    path:'form',
    component:MedidorFormComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedidoresAguaRoutingModule { }
