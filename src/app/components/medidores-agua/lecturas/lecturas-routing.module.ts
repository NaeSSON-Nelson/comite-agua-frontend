import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarLecturasComponent } from './registrar-lecturas/registrar-lecturas.component';

import { ReportesComponent } from './reportes/reportes.component';
import { ValidItemMenu } from 'src/app/interfaces/routes-app';

const routes: Routes = [
  {
    path:ValidItemMenu.lecturasListarAfiliadosPlanillasLecturas,
    component: RegistrarLecturasComponent,
  },
  {
    path:'reportes',
    component: ReportesComponent,
  },
  {
    path: '**',
    redirectTo: ValidItemMenu.lecturasListarAfiliadosPlanillasLecturas,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LecturasRoutingModule { }
