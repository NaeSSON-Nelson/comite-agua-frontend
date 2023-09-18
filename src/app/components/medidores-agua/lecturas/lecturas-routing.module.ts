import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarLecturasComponent } from './registrar-lecturas/registrar-lecturas.component';
import { LecturasComponent } from './lecturas/lecturas.component';
import { ReportesComponent } from './reportes/reportes.component';

const routes: Routes = [
  {
    path:'',
    component:LecturasComponent,
  },{
    path: 'lecturas-all-register',
    component: RegistrarLecturasComponent,
  },
  {
    path:'reportes',
    component: ReportesComponent,
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
export class LecturasRoutingModule { }
