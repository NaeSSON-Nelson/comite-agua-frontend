import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarLecturasComponent } from './registrar-lecturas/registrar-lecturas.component';

import { ValidItemMenu } from 'src/app/interfaces/routes-app';

const routes: Routes = [
  {
    path:ValidItemMenu.lecturasListarAfiliadosPlanillasLecturas,
    component: RegistrarLecturasComponent,
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
